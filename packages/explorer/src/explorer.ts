// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/explorer
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

const swaggerUI = require('swagger-ui-dist');

import * as path from 'path';
import * as fs from 'fs';

import {Router} from 'express';
import * as serveStatic from 'serve-static';
import * as ejs from 'ejs';

/**
 * Options to configure API Explorer UI
 */
export type ApiExplorerUIOptions = {
  /**
   * URL to the OpenAPI spec
   */
  openApiSpecUrl?: string;

  /**
   * Custom EJS template for index.html
   */
  indexHtmlTemplate?: string;

  /**
   * Options for serve-static middleware
   */
  serveStaticOptions?: serveStatic.ServeStaticOptions;
};

/**
 * Mount the API Explorer UI (swagger-ui) to the given express router
 * @param expressRouter
 * @param options
 */
export function apiExplorerUI(
  expressRouter: Router,
  options: ApiExplorerUIOptions = {},
) {
  const openApiSpecUrl = options.openApiSpecUrl || '';
  const indexHtml =
    options.indexHtmlTemplate || path.resolve(__dirname, './index.html.ejs');
  const template = fs.readFileSync(indexHtml, 'utf-8');
  const templateFn = ejs.compile(template);

  expressRouter.use('/index.html', (req, res, next) => {
    const data = {
      openApiSpecUrl,
    };
    const homePage = templateFn(data);
    res
      .status(200)
      .contentType('text/html')
      .send(homePage);
  });

  expressRouter.use(
    serveStatic(swaggerUI.getAbsoluteFSPath(), options.serveStaticOptions),
  );
}
