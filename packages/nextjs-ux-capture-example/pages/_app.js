import React from 'react';
import App from 'next/app';
import Router from 'next/router';

import Link from 'next/link';
import Head from 'next/head';
import getConfig from 'next/config';

import UXCaptureCreate from '@meetup/react-ux-capture/lib/UXCaptureCreate';
import UXCaptureInlineMark from '@meetup/react-ux-capture/lib/UXCaptureInlineMark';

import Logo from '../components/Logo';

import { getBoxStyle } from '../components/ZoneHelper';

import { LOGO_INLINE } from '../ux-capture-zones';

const { serverRuntimeConfig } = getConfig();

class MyApp extends App {
	handleRouteChange(url) {
		window && window.UXCapture.startTransition();
	}

	componentDidMount() {
		Router.events.on('routeChangeStart', this.handleRouteChange);
	}

	componentDidUnMount() {
		Router.events.off('routeChangeStart', this.handleRouteChange);
	}
	render() {
		const { Component, pageProps } = this.props;

		const navClass = 'flex-item flex-item--shrink padding--all';

		return (
			<div className="flex flex--column atLarge_flex--row">
				<Head>
					<link href="/layout.css" rel="stylesheet" key="maincss" />
					<link rel="icon" href="/favicon.ico" key="icon" />
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
					<div className="flex flex-item">
						<div className="bounds">
							<div className="section">
								<Component {...pageProps} />
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default MyApp;
