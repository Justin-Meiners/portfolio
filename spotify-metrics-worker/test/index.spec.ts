import { env, SELF } from 'cloudflare:test'
import { describe, expect, it } from 'vitest'
import worker from '../src/index'

const IncomingRequest = Request<unknown, IncomingRequestCfProperties>

describe('Spotify metrics worker routes', () => {
	it('returns 404 outside the metrics route', async () => {
		const request = new IncomingRequest('https://example.com/')
		const response = await worker.fetch(request, env)

		expect(response.status).toBe(404)
		expect(await response.json()).toEqual({ error: 'Not found' })
	})

	it('answers CORS preflight requests', async () => {
		const response = await SELF.fetch('https://example.com/metrics', {
			method: 'OPTIONS',
			headers: { Origin: 'https://justinmeiners.com' },
		})

		expect(response.status).toBe(204)
		expect(response.headers.get('Access-Control-Allow-Origin')).toBe(
			'https://justinmeiners.com',
		)
	})
})
