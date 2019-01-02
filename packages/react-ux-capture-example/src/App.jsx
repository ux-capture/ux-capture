import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import UXCapture from '@meetup/ux-capture/src/UXCapture';
import Logo from './Logo';
import PerfContext from './marks/PerfContext';
import Home from './Home';
import Bar from './Bar';
import Foo from './Foo';
import './App.css';

class TransitionManager extends React.Component {
	componentDidUpdate(prevProps) {
		if (prevProps.path !== this.props.path) {
			console.log('transition to', this.props.path);
			window.UXCapture.startTransition();
		}
	}
	render() {
		return null;
	}
}
class App extends Component {
	constructor(props) {
		super(props);
		window.UXCapture = UXCapture;
		window.UXCapture.create({
			onMeasure: name => {
				// there can be multiple entries with the same name, get the latest
				const measure = performance
					.getEntriesByType('measure')
					.filter(entry => entry.name === name)
					.pop();

				if (measure.duration) {
					// in real world you might be sending this to your custom monitoring solution
					// (because it does not support W3C UserTiming API natively)
					this.setState(state => ({
						measures: [measure].concat(state.measures),
					}));
				}
			},
			onMark: lastMark =>
				this.setState(state => ({ marks: [lastMark].concat(state.marks) })),
		});
		this.state = { measures: [], marks: [] };
	}
	componentWillUnmount() {
		window.UXCapture.destroy();
	}
	render() {
		const menuLinkClass = 'flex-item flex-item--shrink padding--all';
		return (
			<Router>
				<PerfContext.Provider value={this.state}>
					<div className="flex flex-item">
						<div className="flex-item valign-middle">
							<Logo />
						</div>
						<Link className={menuLinkClass} to="/">
							Home
						</Link>
						<Link className={menuLinkClass} to="/foo">
							Foo
						</Link>
						<Link className={menuLinkClass} to="/bar">
							Bar
						</Link>
					</div>
					<div className="flex flex--column atLarge_flex--row">
						<div
							className="stripe inverted flex-item"
							style={{ backgroundColor: '#444', maxWidth: '480px' }}
						>
							<div className="section inverted">
								<div className="bounds chunk">
									<div className="chunk">
										<h3>Recent marks:</h3>
										{this.state.marks
											.slice(0, 8)
											.map((mark, key) => (
												<div
													key={key}
													className="flex text--secondary text--small border--top border--bottom"
												>
													<div className="flex-item">
														{mark}
													</div>
													<div className="flex-item" />
												</div>
											))}
									</div>
									<div className="chunk">
										<h3>Recent measures:</h3>
										{this.state.measures
											.slice(0, 8)
											.map((measure, key) => (
												<div
													key={key}
													className="flex text--secondary text--small border--top border--bottom"
												>
													<div className="flex-item">
														{measure.name}
													</div>
													<div className="flex-item">
														🕒{' '}
														{Math.round(
															measure.duration * 10
														) / 10}
														ms
													</div>
												</div>
											))}
									</div>
								</div>
							</div>
						</div>
						<Route
							children={({ location }) => (
								<div className="stripe flex-item">
									<TransitionManager path={location.pathname} />
									<Route exact path="/" component={Home} />
									<Route exact path="/foo" component={Foo} />
									<Route exact path="/bar" component={Bar} />
								</div>
							)}
						/>
					</div>
				</PerfContext.Provider>
			</Router>
		);
	}
}

export default App;
