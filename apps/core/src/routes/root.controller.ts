import { appConfig } from '@/environment';
import express from 'express';

export async function getInfo(req: express.Request, res: express.Response) {
  res.send({
    apiVersion: 'v1',
    version: appConfig.packageVersion,
    repo: appConfig.repository,
  });
}
