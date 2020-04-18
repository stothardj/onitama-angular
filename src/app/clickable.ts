import { ClickTarget } from './click-target';

export interface Clickable {
  getClickTargets: () => ClickTarget[];
}
