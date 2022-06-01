import { ComponentRegistry, 
  ExtensionRegistry, 
  MailboxPerspective,
  DatabaseStore,
  Thread,
  AccountStore,
  MutableQuerySubscription,
  localized } from 'mailspring-exports';

import StarredWithCountThreadCountsStore from './starred-with-count-store';

class StarredWithCountMailboxPerspective extends MailboxPerspective {

  starred = true;
  name = localized('Starred');
  iconName = 'starred.png';

  threads() {
    const query = DatabaseStore.findAll(Thread)
      .where([Thread.attributes.starred.equal(true), Thread.attributes.inAllMail.equal(true)])
      .limit(0);

    // Adding a "account_id IN (a,b,c)" clause to our query can result in a full
    // table scan. Don't add the where clause if we know we want results from all.
    if (this.accountIds.length < AccountStore.accounts().length) {
      query.where(Thread.attributes.accountId.in(this.accountIds));
    }

    return new MutableQuerySubscription(query, {
      emitResultSet: true,
      updateOnSeparateThread: true,
    });
  }

  canReceiveThreadsFromAccountIds(threads) {
    return super.canReceiveThreadsFromAccountIds(threads);
  }

  actionsForReceivingThreads(threads, accountId) {
    ChangeStarredTask =
      ChangeStarredTask || require('./flux/tasks/change-starred-task').ChangeStarredTask;
    return new ChangeStarredTask({
      accountId,
      threads,
      starred: true,
      source: 'Dragged Into List',
    });
  }

  tasksForRemovingItems(threads, source) {
    const task = TaskFactory.taskForInvertingStarred({
      threads: threads,
      source: 'Removed From List',
    });
    return [task];
  }

  unreadCount() {
    let count = 0;
    for (const aid of this.accountIds) {
      count += StarredWithCountThreadCountsStore.totalCountForAccount(aid);
    }
    return count;
  }

}

const AccountSidebarExtension = {
  name: 'StarredWithCount',

  sidebarItem(accountIds) {
    return {
      id: 'StarredWithCount',
      name: localized('Starred'),
      iconName: 'starred.png',
      perspective: new StarredWithCountMailboxPerspective(accountIds),
    };
  },
};

// Activate is called when the package is loaded. If your package previously
// saved state using `serialize` it is provided.
//
export function activate() {
  ExtensionRegistry.AccountSidebar.register(AccountSidebarExtension);
}

// Serialize is called when your package is about to be unmounted.
// You can return a state object that will be passed back to your package
// when it is re-activated.
//
export function serialize() {}

// This **optional** method is called when the window is shutting down,
// or when your package is being updated or disabled. If your package is
// watching any files, holding external resources, providing commands or
// subscribing to events, release them here.
//
export function deactivate() {
  ExtensionRegistry.AccountSidebar.unregister(AccountSidebarExtension);
}
