import React from 'react';
import { getBoxStyle } from './ZoneHelper';
import UXCaptureInlineMark from '@meetup/react-ux-capture/lib/UXCaptureInlineMark';

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
			return null;
		}
		return (
			<div style={getBoxStyle(this.props.zone)}>
				This was loaded lazily in {this.props.delay}ms
				<UXCaptureInlineMark mark={this.props.mark} />
			</div>
		);
	}
}
