import { DtoWithExpired } from '@app/shared/types/shared.types';

import * as _ from 'lodash';

export class ExpiredUtil {

  public static addSelectedItemIfNotContains<T>(list: T[], selectedItem: T): DtoWithExpired<T>[] {
    const item: DtoWithExpired<T> = _.assign({}, selectedItem);
    const items: DtoWithExpired<T>[] = _.map(list, (listItem: T) => _.assign({}, listItem));

    if (!_.some(list, ['id', _.get(selectedItem, 'id', null)])) {
      item.expired = true;
    }

    items.unshift(item);

    return _.uniqBy(items, 'id');
  }
}
