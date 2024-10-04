'use server';

import { db } from '@/db';
import {
  CaseColor,
  CaseFinish,
  CaseMaterial,
  PhoneModel,
} from '@prisma/client';

export type SaveConfigArgs = {
  color: CaseColor;
  model: PhoneModel;
  material: CaseMaterial;
  finish: CaseFinish;
  configId?: string;
};
// RPC -> Remote Procedure Call
// save config to update db with new data user choice.
export async function saveConfig({
  color,
  finish,
  material,
  model,
  configId,
}: SaveConfigArgs) {
  await db.configuration.update({
    where: { id: configId },
    data: { color, finish, material, model },
  });
}
