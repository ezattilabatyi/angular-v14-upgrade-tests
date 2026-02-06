import { ScenarioType } from '@app/pages/components/dealcapture/deal-handler/type/deal-details.type';

export class DealManagerNavigationUtil {

  public static getPathByScenarioType(scenarioType: ScenarioType): string {
    return scenarioType === ScenarioType.CONCLUDED ? 'dealmanager' : 'virtualdealmanager';
  }
}
