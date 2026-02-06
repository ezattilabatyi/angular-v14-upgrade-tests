import * as _ from 'lodash';

export class TreeUtil {

  public static find<T>(items: T[], key: string): T[] {
    return items.reduce((treeItems: T[], item: T) => {
      treeItems.push(item);
      if (_.isArray(item[key])) {
        treeItems = treeItems.concat(TreeUtil.find(item[key], key));
      }
      return treeItems;
    }, []);
  }

}
