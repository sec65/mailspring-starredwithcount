import MailspringStore from 'mailspring-store';
import { DatabaseStore,
  Thread } from 'mailspring-exports';

class StarredWithCountThreadCountsStore extends MailspringStore {
  _counts = {};

  constructor() {
    super();

    if (AppEnv.isMainWindow()) {
      // For now, unread counts are only retrieved in the main window.
      //const onCountsChangedDebounced = _.throttle(this._onCountsChanged, 1000);
      DatabaseStore.listen(change => {
        if (change.objectClass === Thread.name) {
          this._onCountsChanged();
        }
      });
      this._onCountsChanged();
    }
  }

  _onCountsChanged = () => {
    DatabaseStore.findAll(Thread)
      .where([Thread.attributes.starred.equal(true), Thread.attributes.inAllMail.equal(true)]).
      then(results => {
        let nextCounts = {};

        for (const t of results) {

          if (nextCounts[t.accountId] == undefined) {
            nextCounts[t.accountId] = 0;
          }
          nextCounts[t.accountId] += 1;
        }

        this._counts = nextCounts;
        this.trigger();
      });
  };

  totalCountForAccount(accountId) {
    if (this._counts[accountId] === undefined) {
      return 0;
    }
    return this._counts[accountId];
  }
}

export default new StarredWithCountThreadCountsStore();