import React from 'react';
import UXCaptureInlineMark from '@meetup/react-ux-capture/lib/UXCaptureInlineMark';
import PerfContext from './PerfContext';
import MarkInfo from './MarkInfo';

const Inline = props => {
	const { mark } = props;
	return (
		<React.Fragment>
			<PerfContext.Consumer>
				{({ marks }) => (
					<MarkInfo
						mark={
							marks.find(record => record.mark.name === mark)
								? mark
								: null
						}
					/>
				)}
			</PerfContext.Consumer>
			<UXCaptureInlineMark mark={mark} />
		</React.Fragment>
	);
};

export default Inline;
