import express from 'express';
import { appConfig } from '../environment';

export async function getInfo(req: express.Request, res: express.Response) {
  res.send({
    apiVersion: 'v1',
    version: appConfig.packageVersion,
    repo: appConfig.repository,
  });
}
