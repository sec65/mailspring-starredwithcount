"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mailspring_exports_1 = require("mailspring-exports");
const starred_with_count_store_1 = __importDefault(require("./starred-with-count-store"));
class StarredWithCountMailboxPerspective extends mailspring_exports_1.MailboxPerspective {
    constructor() {
        super(...arguments);
        this.starred = true;
        this.name = mailspring_exports_1.localized('Starred');
        this.iconName = 'starred.png';
    }
    threads() {
        const query = mailspring_exports_1.DatabaseStore.findAll(mailspring_exports_1.Thread)
            .where([mailspring_exports_1.Thread.attributes.starred.equal(true), mailspring_exports_1.Thread.attributes.inAllMail.equal(true)])
            .limit(0);
        // Adding a "account_id IN (a,b,c)" clause to our query can result in a full
        // table scan. Don't add the where clause if we know we want results from all.
        if (this.accountIds.length < mailspring_exports_1.AccountStore.accounts().length) {
            query.where(mailspring_exports_1.Thread.attributes.accountId.in(this.accountIds));
        }
        return new mailspring_exports_1.MutableQuerySubscription(query, {
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
            count += starred_with_count_store_1.default.totalCountForAccount(aid);
        }
        return count;
    }
}
const AccountSidebarExtension = {
    name: 'StarredWithCount',
    sidebarItem(accountIds) {
        return {
            id: 'StarredWithCount',
            name: mailspring_exports_1.localized('Starred'),
            iconName: 'starred.png',
            perspective: new StarredWithCountMailboxPerspective(accountIds),
        };
    },
};
// Activate is called when the package is loaded. If your package previously
// saved state using `serialize` it is provided.
//
function activate() {
    mailspring_exports_1.ExtensionRegistry.AccountSidebar.register(AccountSidebarExtension);
}
exports.activate = activate;
// Serialize is called when your package is about to be unmounted.
// You can return a state object that will be passed back to your package
// when it is re-activated.
//
function serialize() { }
exports.serialize = serialize;
// This **optional** method is called when the window is shutting down,
// or when your package is being updated or disabled. If your package is
// watching any files, holding external resources, providing commands or
// subscribing to events, release them here.
//
function deactivate() {
    mailspring_exports_1.ExtensionRegistry.AccountSidebar.unregister(AccountSidebarExtension);
}
exports.deactivate = deactivate;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsMkRBT3dDO0FBRXhDLDBGQUEyRTtBQUUzRSxNQUFNLGtDQUFtQyxTQUFRLHVDQUFrQjtJQUFuRTs7UUFFRSxZQUFPLEdBQUcsSUFBSSxDQUFDO1FBQ2YsU0FBSSxHQUFHLDhCQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDNUIsYUFBUSxHQUFHLGFBQWEsQ0FBQztJQWtEM0IsQ0FBQztJQWhEQyxPQUFPO1FBQ0wsTUFBTSxLQUFLLEdBQUcsa0NBQWEsQ0FBQyxPQUFPLENBQUMsMkJBQU0sQ0FBQzthQUN4QyxLQUFLLENBQUMsQ0FBQywyQkFBTSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLDJCQUFNLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzthQUN2RixLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFWiw0RUFBNEU7UUFDNUUsOEVBQThFO1FBQzlFLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEdBQUcsaUNBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxNQUFNLEVBQUU7WUFDM0QsS0FBSyxDQUFDLEtBQUssQ0FBQywyQkFBTSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1NBQzlEO1FBRUQsT0FBTyxJQUFJLDZDQUF3QixDQUFDLEtBQUssRUFBRTtZQUN6QyxhQUFhLEVBQUUsSUFBSTtZQUNuQixzQkFBc0IsRUFBRSxJQUFJO1NBQzdCLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCwrQkFBK0IsQ0FBQyxPQUFPO1FBQ3JDLE9BQU8sS0FBSyxDQUFDLCtCQUErQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFFRCwwQkFBMEIsQ0FBQyxPQUFPLEVBQUUsU0FBUztRQUMzQyxpQkFBaUI7WUFDZixpQkFBaUIsSUFBSSxPQUFPLENBQUMsa0NBQWtDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQztRQUNyRixPQUFPLElBQUksaUJBQWlCLENBQUM7WUFDM0IsU0FBUztZQUNULE9BQU87WUFDUCxPQUFPLEVBQUUsSUFBSTtZQUNiLE1BQU0sRUFBRSxtQkFBbUI7U0FDNUIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELHFCQUFxQixDQUFDLE9BQU8sRUFBRSxNQUFNO1FBQ25DLE1BQU0sSUFBSSxHQUFHLFdBQVcsQ0FBQyx1QkFBdUIsQ0FBQztZQUMvQyxPQUFPLEVBQUUsT0FBTztZQUNoQixNQUFNLEVBQUUsbUJBQW1CO1NBQzVCLENBQUMsQ0FBQztRQUNILE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNoQixDQUFDO0lBRUQsV0FBVztRQUNULElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNkLEtBQUssTUFBTSxHQUFHLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNqQyxLQUFLLElBQUksa0NBQWlDLENBQUMsb0JBQW9CLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDdEU7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7Q0FFRjtBQUVELE1BQU0sdUJBQXVCLEdBQUc7SUFDOUIsSUFBSSxFQUFFLGtCQUFrQjtJQUV4QixXQUFXLENBQUMsVUFBVTtRQUNwQixPQUFPO1lBQ0wsRUFBRSxFQUFFLGtCQUFrQjtZQUN0QixJQUFJLEVBQUUsOEJBQVMsQ0FBQyxTQUFTLENBQUM7WUFDMUIsUUFBUSxFQUFFLGFBQWE7WUFDdkIsV0FBVyxFQUFFLElBQUksa0NBQWtDLENBQUMsVUFBVSxDQUFDO1NBQ2hFLENBQUM7SUFDSixDQUFDO0NBQ0YsQ0FBQztBQUVGLDRFQUE0RTtBQUM1RSxnREFBZ0Q7QUFDaEQsRUFBRTtBQUNGLFNBQWdCLFFBQVE7SUFDdEIsc0NBQWlCLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBQ3JFLENBQUM7QUFGRCw0QkFFQztBQUVELGtFQUFrRTtBQUNsRSx5RUFBeUU7QUFDekUsMkJBQTJCO0FBQzNCLEVBQUU7QUFDRixTQUFnQixTQUFTLEtBQUksQ0FBQztBQUE5Qiw4QkFBOEI7QUFFOUIsdUVBQXVFO0FBQ3ZFLHdFQUF3RTtBQUN4RSx3RUFBd0U7QUFDeEUsNENBQTRDO0FBQzVDLEVBQUU7QUFDRixTQUFnQixVQUFVO0lBQ3hCLHNDQUFpQixDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUN2RSxDQUFDO0FBRkQsZ0NBRUMifQ==