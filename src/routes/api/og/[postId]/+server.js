import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

export const prerender = false;

let fontCache = null;

async function getFont() {
	if (fontCache) return fontCache;
	const res = await fetch(
		'https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2304-2@1.0/Galmuri11.woff'
	);
	fontCache = await res.arrayBuffer();
	return fontCache;
}

export async function GET({ url }) {
	const title = url.searchParams.get('title') || 'bloKoo';

	const fontData = await getFont();

	const svg = await satori(
		{
			type: 'div',
			props: {
				style: {
					width: '100%',
					height: '100%',
					backgroundColor: '#000080',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
					padding: '40px'
				},
				children: [
					{
						type: 'div',
						props: {
							style: {
								position: 'absolute',
								top: '16px',
								left: '16px',
								right: '16px',
								bottom: '16px',
								border: '2px solid white',
								display: 'flex'
							}
						}
					},
					{
						type: 'div',
						props: {
							style: {
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
								flexGrow: 1,
								padding: '20px 20px 0 20px'
							},
							children: [
								{
									type: 'div',
									props: {
										style: {
											color: 'white',
											fontSize: '48px',
											fontFamily: 'Galmuri11',
											lineHeight: 1.4,
											wordBreak: 'break-word'
										},
										children: title
									}
								}
							]
						}
					},
					{
						type: 'div',
						props: {
							style: {
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'flex-end',
								padding: '0 20px'
							},
							children: [
								{
									type: 'div',
									props: {
										style: {
											color: '#8888cc',
											fontSize: '24px',
											fontFamily: 'Galmuri11'
										},
										children: 'bloKoo'
									}
								},
								{
									type: 'div',
									props: {
										style: {
											color: '#8888cc',
											fontSize: '20px',
											fontFamily: 'Galmuri11'
										},
										children: 'blog.ilmokoo.com'
									}
								}
							]
						}
					}
				]
			}
		},
		{
			width: 1200,
			height: 630,
			fonts: [
				{
					name: 'Galmuri11',
					data: fontData,
					weight: 400,
					style: 'normal'
				}
			]
		}
	);

	const resvg = new Resvg(svg, {
		fitTo: { mode: 'width', value: 1200 }
	});
	const pngData = resvg.render();
	const pngBuffer = pngData.asPng();

	return new Response(pngBuffer, {
		headers: {
			'Content-Type': 'image/png',
			'Cache-Control': 'public, max-age=86400'
		}
	});
}
