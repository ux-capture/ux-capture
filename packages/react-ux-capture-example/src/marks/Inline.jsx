import React from 'react';
import UXCaptureInlineMark from 'mwp-app-render/lib/components/uxcapture/UXCaptureInlineMark';
import PerfContext from './PerfContext';
import MarkInfo from './MarkInfo';

const Inline = props => {
	const { mark } = props;
	return (
		<React.Fragment>
			<PerfContext.Consumer>
				{({ marks }) => <MarkInfo mark={marks.find(m => m === mark)} />}
			</PerfContext.Consumer>
			<UXCaptureInlineMark mark={mark} />
		</React.Fragment>
	);
};

export default Inline;
