// import { readFileSync, readdirSync } from 'fs'
import { it, describe, expect, vi, beforeEach } from 'vitest'
import { findSvgFile, svgBuilder } from '@/utils/svgBuilder.js'
import fs from 'fs'

describe('svgBuilder', () => {
  vi.mock('@/utils/svgBuilder.js', async () => {
    const originalModule = await vi.importActual('@/utils/svgBuilder.js')
    const mockSvgContent = [
      '<symbol id="-arrowDown"  xmlns="http://www.w3.org/2000/svg"   viewBox="0 0 10 12.852"><defs><clipPath id="owhp26slba"><path data-name="Rectangle 51" style="fill:#67c23a" d="M0 0h12.852v10H0z"/></clipPath></defs><g data-name="Group 88"><g data-name="Group 86" transform="rotate(90 5 5)" style="clip-path:url(#owhp26slba)"><path data-name="Path 14" d="M8.989 6.177H1.204a1.135 1.135 0 0 1-1.126-.764A1.118 1.118 0 0 1 .43 4.1a1.6 1.6 0 0 1 .838-.268c2.439-.021 4.877-.012 7.316-.012h.4c-.112-.126-.179-.205-.25-.28-.486-.512-.981-1.019-1.463-1.54A1.148 1.148 0 0 1 7 .792a1.09 1.09 0 0 1 .9-.774.985.985 0 0 1 .917.291c1.257 1.3 2.513 2.609 3.753 3.929a1.14 1.14 0 0 1-.058 1.572q-1.794 1.9-3.6 3.783a1.073 1.073 0 0 1-1.59.1 1.183 1.183 0 0 1-.071-1.668c.482-.533.989-1.042 1.485-1.562.074-.078.143-.16.256-.287" fill="currentColor"/></g></g></symbol>'
    ]
    const findSvgFile = vi.fn()
    findSvgFile.mockReturnValue(mockSvgContent)
    return {
      ...originalModule,
      findSvgFile
    }
  })

  beforeEach(() => {})

  it('findSvgFile', () => {
    const svgData =
      '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="12.852" viewBox="0 0 10 12.852"><defs><clipPath id="owhp26slba"><path data-name="Rectangle 51" style="fill:#67c23a" d="M0 0h12.852v10H0z"/></clipPath></defs><g data-name="Group 88"><g data-name="Group 86" transform="rotate(90 5 5)" style="clip-path:url(#owhp26slba)"><path data-name="Path 14" d="M8.989 6.177H1.204a1.135 1.135 0 0 1-1.126-.764A1.118 1.118 0 0 1 .43 4.1a1.6 1.6 0 0 1 .838-.268c2.439-.021 4.877-.012 7.316-.012h.4c-.112-.126-.179-.205-.25-.28-.486-.512-.981-1.019-1.463-1.54A1.148 1.148 0 0 1 7 .792a1.09 1.09 0 0 1 .9-.774.985.985 0 0 1 .917.291c1.257 1.3 2.513 2.609 3.753 3.929a1.14 1.14 0 0 1-.058 1.572q-1.794 1.9-3.6 3.783a1.073 1.073 0 0 1-1.59.1 1.183 1.183 0 0 1-.071-1.668c.482-.533.989-1.042 1.485-1.562.074-.078.143-.16.256-.287" fill="currentColor"/></g></g></svg>'

    vi.mock('fs')
    fs.readdirSync.mockReturnValue([{ isDirectory: () => false, name: 'arrowDown.svg' }])

    // 模擬 readFileSync 返回 SVG 内容
    fs.readFileSync.mockReturnValue(svgData)

    // 執行
    const result = findSvgFile('./src/assets/icons/')

    expect(result).toStrictEqual([
      '<symbol id="-arrowDown"  xmlns="http://www.w3.org/2000/svg"   viewBox="0 0 10 12.852"><defs><clipPath id="owhp26slba"><path data-name="Rectangle 51" style="fill:#67c23a" d="M0 0h12.852v10H0z"/></clipPath></defs><g data-name="Group 88"><g data-name="Group 86" transform="rotate(90 5 5)" style="clip-path:url(#owhp26slba)"><path data-name="Path 14" d="M8.989 6.177H1.204a1.135 1.135 0 0 1-1.126-.764A1.118 1.118 0 0 1 .43 4.1a1.6 1.6 0 0 1 .838-.268c2.439-.021 4.877-.012 7.316-.012h.4c-.112-.126-.179-.205-.25-.28-.486-.512-.981-1.019-1.463-1.54A1.148 1.148 0 0 1 7 .792a1.09 1.09 0 0 1 .9-.774.985.985 0 0 1 .917.291c1.257 1.3 2.513 2.609 3.753 3.929a1.14 1.14 0 0 1-.058 1.572q-1.794 1.9-3.6 3.783a1.073 1.073 0 0 1-1.59.1 1.183 1.183 0 0 1-.071-1.668c.482-.533.989-1.042 1.485-1.562.074-.078.143-.16.256-.287" fill="currentColor"/></g></g></symbol>'
    ])
  })

  it('svgBuilder', () => {
    // 執行
    const result = svgBuilder('./src/assets/icons/')

    // 驗證
    expect(result).toEqual({
      name: 'svg-transform',
      transformIndexHtml: expect.any(Function)
    })

    const mockHtml = '<html><body></body></html>'
    const transformedHtml = result.transformIndexHtml(mockHtml)

    expect(transformedHtml).toStrictEqual(
      `<html><body>
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="position: absolute; width: 0; height: 0">
              <symbol id="icon-arrowDown"  xmlns="http://www.w3.org/2000/svg"   viewBox="0 0 10 12.852"><defs><clipPath id="owhp26slba"><path data-name="Rectangle 51" style="fill:#67c23a" d="M0 0h12.852v10H0z"/></clipPath></defs><g data-name="Group 88"><g data-name="Group 86" transform="rotate(90 5 5)" style="clip-path:url(#owhp26slba)"><path data-name="Path 14" d="M8.989 6.177H1.204a1.135 1.135 0 0 1-1.126-.764A1.118 1.118 0 0 1 .43 4.1a1.6 1.6 0 0 1 .838-.268c2.439-.021 4.877-.012 7.316-.012h.4c-.112-.126-.179-.205-.25-.28-.486-.512-.981-1.019-1.463-1.54A1.148 1.148 0 0 1 7 .792a1.09 1.09 0 0 1 .9-.774.985.985 0 0 1 .917.291c1.257 1.3 2.513 2.609 3.753 3.929a1.14 1.14 0 0 1-.058 1.572q-1.794 1.9-3.6 3.783a1.073 1.073 0 0 1-1.59.1 1.183 1.183 0 0 1-.071-1.668c.482-.533.989-1.042 1.485-1.562.074-.078.143-.16.256-.287" fill="currentColor"/></g></g></symbol>
            </svg>
          </body>
        </html>`
    )
  })
})
