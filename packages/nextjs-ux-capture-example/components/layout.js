import React from 'react';

import getConfig from 'next/config';

import UXCaptureCreate from '@meetup/react-ux-capture/lib/UXCaptureCreate';
import UXCaptureInlineMark from '@meetup/react-ux-capture/lib/UXCaptureInlineMark';

import Link from 'next/link';
import Head from 'next/head';

import { getBoxStyle } from './ZoneHelper';

import Logo from './Logo';

import { LOGO_INLINE } from './Zones';

const { serverRuntimeConfig } = getConfig();

class Layout extends React.Component {
	render() {
		const { children } = this.props;

		const navClass = 'flex-item flex-item--shrink padding--all';

		return (
			<div className="flex flex--column atLarge_flex--row">
				<Head>
					<link href="/layout.css" rel="stylesheet" key="maincss" />
					<script
						key="ux-capture-inline-script"
						dangerouslySetInnerHTML={{
							__html: serverRuntimeConfig.uxCaptureLibraryCode,
						}}
					/>
				</Head>
				<UXCaptureCreate />
				<div className="flex flex-item flex--column">
					<div className="flex flex-item">
						<div
							className="flex-item valign-middle destinationVerified"
							style={{
								...getBoxStyle('ux-destination-verified'),
								paddingTop: 0,
							}}
						>
							<Logo />
							<UXCaptureInlineMark mark={LOGO_INLINE} />
						</div>
						<b className={navClass}>UX Capture Example: React SPA</b>
						<Link href="/">
							<a className={navClass}>Basic</a>
						</Link>
						<Link href="/progressive">
							<a className={navClass}>Progressive</a>
						</Link>
						<Link href="/minimal">
							<a className={navClass}>Minimal</a>
						</Link>
					</div>
					<div className="flex flex-item">{children}</div>
				</div>
			</div>
		);
	}
}
export default Layout;
