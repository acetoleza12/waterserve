/** Values prepared once for each API request. */
export interface RequestContext {
  request: Request;
  db: any;
  url: URL;
  path: string;
  method: string;
  user: any;
  body: any;
}
