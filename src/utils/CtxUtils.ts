import { IAppContext } from "../model/AppContext";
import { RendererType } from "../renderer/RendererType";

export function getConfig<T extends object>(c: { new(): T; }, ctx: IAppContext, key: RendererType): T {
  const config = new c();
  Object.assign(config, ctx.rendererConfigs.get(key) || {});
  return config;
}
