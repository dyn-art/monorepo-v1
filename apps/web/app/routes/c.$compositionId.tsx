import { coreService } from '@/core/api';
import type { TComposition } from '@dyn/types/dtif';
import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import React from 'react';
import {
  Composition,
  links as compositionLinks,
} from '../components/composition';

export const links = () => [...compositionLinks()];

export async function loader(args: LoaderArgs) {
  const {
    params: { compositionId },
  } = args;
  let composition: TComposition | null = null;
  if (compositionId != null) {
    if (compositionId === 'dummy') {
      composition = JSON.parse(dummyComposition);
    } else {
      composition = await coreService.downloadJsonFromS3(compositionId);
    }
  }
  return json<TLoader>({
    id: compositionId,
    composition,
  });
}

const D3CanvasId: React.FC = () => {
  const { id, composition: _composition } = useLoaderData<typeof loader>();
  const composition: TComposition | null = _composition as any;

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <div>
      <h1>{id ?? 'Not found'}</h1>
      {composition != null && <Composition composition={composition} />}
    </div>
  );
};

export default D3CanvasId;

type TLoader = {
  id?: string;
  composition: TComposition | null;
};

const dummyComposition = `
{"version":"1.0","name":"test1.3","width":595,"height":842,"nodes":{"46cd474033769450-1":{"type":"RECTANGLE","name":"Rectangle 18","isLocked":false,"isVisible":true,"height":100,"width":100,"relativeTransform":[[-0.4372614324092865,0.8993344306945801,453.6070251464844],[-0.8993344306945801,-0.4372614324092865,308.5404968261719],[0,0,1]],"constraints":{"horizontal":"CENTER","vertical":"CENTER"},"bottomLeftRadius":0,"bottomRightRadius":0,"topLeftRadius":0,"topRightRadius":0,"blendMode":"PASS_THROUGH","opacity":1,"isMask":false,"effects":[],"fill":{"paintIds":["af89edd99defcc98"]}},"6796be7c58c33180-2":{"type":"RECTANGLE","name":"Rectangle 19","isLocked":false,"isVisible":true,"height":100,"width":100,"relativeTransform":[[-0.9815860986709595,0.19101999700069427,157.23898315429688],[-0.19101999700069427,-0.9815860986709595,659.3410034179688],[0,0,1]],"constraints":{"horizontal":"CENTER","vertical":"CENTER"},"bottomLeftRadius":0,"bottomRightRadius":0,"topLeftRadius":0,"topRightRadius":0,"blendMode":"PASS_THROUGH","opacity":1,"isMask":false,"effects":[],"fill":{"paintIds":["af89edd99defcc98"]}},"2559afc8e23ec73c-3":{"type":"RECTANGLE","name":"Rectangle 17","isLocked":false,"isVisible":true,"height":100,"width":100,"relativeTransform":[[0.7071067690849304,0.7071067690849304,226.289306640625],[-0.7071067690849304,0.7071067690849304,421],[0,0,1]],"constraints":{"horizontal":"CENTER","vertical":"CENTER"},"bottomLeftRadius":0,"bottomRightRadius":0,"topLeftRadius":0,"topRightRadius":0,"blendMode":"PASS_THROUGH","opacity":1,"isMask":false,"effects":[],"fill":{"paintIds":["96a7ef2df38ae191"]}},"5ff8c68fbe783f1d-4":{"type":"RECTANGLE","name":"Rectangle 16","isLocked":false,"isVisible":true,"height":100,"width":100,"relativeTransform":[[0.9460397362709045,-0.32405051589012146,445.611328125],[0.32405051589012146,0.9460397362709045,537],[0,0,1]],"constraints":{"horizontal":"CENTER","vertical":"CENTER"},"bottomLeftRadius":0,"bottomRightRadius":0,"topLeftRadius":0,"topRightRadius":0,"blendMode":"PASS_THROUGH","opacity":1,"isMask":false,"effects":[],"fill":{"paintIds":["af89edd99defcc98"]}},"cfc53a2aa7a06661-5":{"type":"RECTANGLE","name":"Rectangle 20","isLocked":false,"isVisible":true,"height":100,"width":100,"relativeTransform":[[5.551115123125783e-17,1,427],[-1,5.551115123125783e-17,462],[0,0,1]],"constraints":{"horizontal":"CENTER","vertical":"CENTER"},"bottomLeftRadius":0,"bottomRightRadius":0,"topLeftRadius":0,"topRightRadius":0,"blendMode":"PASS_THROUGH","opacity":1,"isMask":false,"effects":[],"fill":{"paintIds":["af89edd99defcc98"]}},"3e382d4c5b2845bc-6":{"type":"RECTANGLE","name":"Rectangle 21","isLocked":false,"isVisible":true,"height":100,"width":100,"relativeTransform":[[5.551115123125783e-17,1,68],[-1,5.551115123125783e-17,462],[0,0,1]],"constraints":{"horizontal":"CENTER","vertical":"CENTER"},"bottomLeftRadius":0,"bottomRightRadius":0,"topLeftRadius":0,"topRightRadius":0,"blendMode":"PASS_THROUGH","opacity":1,"isMask":false,"effects":[],"fill":{"paintIds":["af89edd99defcc98"]}},"e4e8f3cee1a7e0e7-7":{"type":"RECTANGLE","name":"Rectangle 15","isLocked":false,"isVisible":true,"height":100,"width":100,"relativeTransform":[[-0.9720180034637451,0.23490625619888306,154.56629943847656],[-0.23490625619888306,-0.9720180034637451,302.0569152832031],[0,0,1]],"constraints":{"horizontal":"CENTER","vertical":"CENTER"},"bottomLeftRadius":0,"bottomRightRadius":0,"topLeftRadius":0,"topRightRadius":0,"blendMode":"PASS_THROUGH","opacity":1,"isMask":false,"effects":[],"fill":{"paintIds":["af89edd99defcc98"]}},"078452b4a459463b-8":{"type":"RECTANGLE","name":"Rectangle 22","isLocked":false,"isVisible":true,"height":100,"width":100,"relativeTransform":[[-1,1.1674349386051622e-16,347.0000305175781],[-1.1674349386051622e-16,-1,292],[0,0,1]],"constraints":{"horizontal":"CENTER","vertical":"CENTER"},"bottomLeftRadius":0,"bottomRightRadius":0,"topLeftRadius":0,"topRightRadius":0,"blendMode":"PASS_THROUGH","opacity":1,"isMask":false,"effects":[],"fill":{"paintIds":["af89edd99defcc98"]}},"e483631fa12921ba-9":{"type":"RECTANGLE","name":"Rectangle 23","isLocked":false,"isVisible":true,"height":100,"width":100,"relativeTransform":[[2.220446049250313e-16,-1,347],[1,2.220446049250313e-16,551],[0,0,1]],"constraints":{"horizontal":"CENTER","vertical":"CENTER"},"bottomLeftRadius":0,"bottomRightRadius":0,"topLeftRadius":0,"topRightRadius":0,"blendMode":"PASS_THROUGH","opacity":1,"isMask":false,"effects":[],"fill":{"paintIds":["af89edd99defcc98"]}},"02dce0769f7aebf2-10":{"type":"RECTANGLE","name":"Rectangle 2","isLocked":false,"isVisible":true,"height":50,"width":50,"relativeTransform":[[1,0,0],[0,1,0],[0,0,1]],"constraints":{"horizontal":"MIN","vertical":"MIN"},"bottomLeftRadius":0,"bottomRightRadius":0,"topLeftRadius":0,"topRightRadius":0,"blendMode":"PASS_THROUGH","opacity":1,"isMask":false,"effects":[],"fill":{"paintIds":["b13c215d2f40969"]}},"bb2ebcb54e7f742a-11":{"type":"RECTANGLE","name":"Rectangle 24","isLocked":false,"isVisible":true,"height":50,"width":50,"relativeTransform":[[1,0,545],[0,1,0],[0,0,1]],"constraints":{"horizontal":"MIN","vertical":"MIN"},"bottomLeftRadius":0,"bottomRightRadius":0,"topLeftRadius":0,"topRightRadius":0,"blendMode":"PASS_THROUGH","opacity":1,"isMask":false,"effects":[],"fill":{"paintIds":["af89edd99defcc98"]}},"2e14e7fbbbcaf398-12":{"type":"RECTANGLE","name":"Rectangle 25","isLocked":false,"isVisible":true,"height":50,"width":50,"relativeTransform":[[1,0,545],[0,1,792],[0,0,1]],"constraints":{"horizontal":"MIN","vertical":"MIN"},"bottomLeftRadius":0,"bottomRightRadius":0,"topLeftRadius":0,"topRightRadius":0,"blendMode":"PASS_THROUGH","opacity":1,"isMask":false,"effects":[],"fill":{"paintIds":["b13c215d2f40969"]}},"d31dbec6afc0c37a-13":{"type":"RECTANGLE","name":"Rectangle 26","isLocked":false,"isVisible":true,"height":50,"width":50,"relativeTransform":[[1,0,0],[0,1,792],[0,0,1]],"constraints":{"horizontal":"MIN","vertical":"MIN"},"bottomLeftRadius":0,"bottomRightRadius":0,"topLeftRadius":0,"topRightRadius":0,"blendMode":"PASS_THROUGH","opacity":1,"isMask":false,"effects":[],"fill":{"paintIds":["af89edd99defcc98"]}},"882e4bb394060686-0":{"type":"FRAME","clipsContent":true,"name":"test1.3","isLocked":false,"isVisible":true,"childIds":["46cd474033769450-1","6796be7c58c33180-2","2559afc8e23ec73c-3","5ff8c68fbe783f1d-4","cfc53a2aa7a06661-5","3e382d4c5b2845bc-6","e4e8f3cee1a7e0e7-7","078452b4a459463b-8","e483631fa12921ba-9","02dce0769f7aebf2-10","bb2ebcb54e7f742a-11","2e14e7fbbbcaf398-12","d31dbec6afc0c37a-13"],"height":842,"width":595,"relativeTransform":[[1,0,0],[0,1,0],[0,0,1]],"constraints":{"horizontal":"MIN","vertical":"MIN"},"bottomLeftRadius":0,"bottomRightRadius":0,"topLeftRadius":0,"topRightRadius":0,"blendMode":"PASS_THROUGH","opacity":1,"isMask":false,"effects":[],"fill":{"paintIds":["b6ecd5a27e6e1066"]}}},"paints":{"af89edd99defcc98":{"type":"SOLID","blendMode":"NORMAL","color":{"r":0.8509804010391235,"g":0.8509804010391235,"b":0.8509804010391235},"opacity":1,"isVisible":true},"96a7ef2df38ae191":{"type":"SOLID","blendMode":"NORMAL","color":{"r":0.3921600580215454,"g":0.3102000653743744,"b":0.7200000286102295},"opacity":1,"isVisible":true},"b13c215d2f40969":{"type":"SOLID","blendMode":"NORMAL","color":{"r":1,"g":0,"b":0},"opacity":1,"isVisible":true},"b6ecd5a27e6e1066":{"type":"SOLID","blendMode":"NORMAL","color":{"r":1,"g":0.6550521850585938,"b":0.6550521850585938},"opacity":1,"isVisible":true}},"typefaces":{},"rootId":"882e4bb394060686-0"}
`;
