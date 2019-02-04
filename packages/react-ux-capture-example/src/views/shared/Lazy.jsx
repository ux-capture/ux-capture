import React from 'react';

// Simple lazy-loading content that records the supplied user timing mark
// after the supplied `delay` milliseconds
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
			return this.props.fallback || null;
		}
		return this.props.children;
	}
}
