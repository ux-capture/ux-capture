import React from 'react';

export default class Lazy extends React.Component {
	constructor(props) {
		super(props);
		this.state = { loaded: false };
	}
	componentDidMount() {
		this.timeout = setTimeout(
			() => this.setState({ loaded: true }),
			this.props.delay
		);
	}
	componentWillUnmount() {
		clearTimeout(this.timeout);
	}
	render() {
		if (!this.state.loaded) {
			return <React.Fragment>{this.props.fallback}</React.Fragment> || null;
		}
		return <React.Fragment>{this.props.children}</React.Fragment>;
	}
}
