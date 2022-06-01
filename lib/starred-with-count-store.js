"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mailspring_store_1 = __importDefault(require("mailspring-store"));
const mailspring_exports_1 = require("mailspring-exports");
class StarredWithCountThreadCountsStore extends mailspring_store_1.default {
    constructor() {
        super();
        this._counts = {};
        this._onCountsChanged = () => {
            mailspring_exports_1.DatabaseStore.findAll(mailspring_exports_1.Thread)
                .where([mailspring_exports_1.Thread.attributes.starred.equal(true), mailspring_exports_1.Thread.attributes.inAllMail.equal(true)]).
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
        if (AppEnv.isMainWindow()) {
            // For now, unread counts are only retrieved in the main window.
            //const onCountsChangedDebounced = _.throttle(this._onCountsChanged, 1000);
            mailspring_exports_1.DatabaseStore.listen(change => {
                if (change.objectClass === mailspring_exports_1.Thread.name) {
                    this._onCountsChanged();
                }
            });
            this._onCountsChanged();
        }
    }
    totalCountForAccount(accountId) {
        if (this._counts[accountId] === undefined) {
            return 0;
        }
        return this._counts[accountId];
    }
}
exports.default = new StarredWithCountThreadCountsStore();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhcnJlZC13aXRoLWNvdW50LXN0b3JlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3N0YXJyZWQtd2l0aC1jb3VudC1zdG9yZS5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSx3RUFBK0M7QUFDL0MsMkRBQ3FDO0FBRXJDLE1BQU0saUNBQWtDLFNBQVEsMEJBQWU7SUFHN0Q7UUFDRSxLQUFLLEVBQUUsQ0FBQztRQUhWLFlBQU8sR0FBRyxFQUFFLENBQUM7UUFpQmIscUJBQWdCLEdBQUcsR0FBRyxFQUFFO1lBQ3RCLGtDQUFhLENBQUMsT0FBTyxDQUFDLDJCQUFNLENBQUM7aUJBQzFCLEtBQUssQ0FBQyxDQUFDLDJCQUFNLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsMkJBQU0sQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUN4RixJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ2IsSUFBSSxVQUFVLEdBQUcsRUFBRSxDQUFDO2dCQUVwQixLQUFLLE1BQU0sQ0FBQyxJQUFJLE9BQU8sRUFBRTtvQkFFdkIsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLFNBQVMsRUFBRTt3QkFDeEMsVUFBVSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7cUJBQzdCO29CQUNELFVBQVUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUM5QjtnQkFFRCxJQUFJLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQztnQkFDMUIsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ2pCLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDO1FBN0JBLElBQUksTUFBTSxDQUFDLFlBQVksRUFBRSxFQUFFO1lBQ3pCLGdFQUFnRTtZQUNoRSwyRUFBMkU7WUFDM0Usa0NBQWEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUU7Z0JBQzVCLElBQUksTUFBTSxDQUFDLFdBQVcsS0FBSywyQkFBTSxDQUFDLElBQUksRUFBRTtvQkFDdEMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7aUJBQ3pCO1lBQ0gsQ0FBQyxDQUFDLENBQUM7WUFDSCxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztTQUN6QjtJQUNILENBQUM7SUFxQkQsb0JBQW9CLENBQUMsU0FBUztRQUM1QixJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEtBQUssU0FBUyxFQUFFO1lBQ3pDLE9BQU8sQ0FBQyxDQUFDO1NBQ1Y7UUFDRCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDakMsQ0FBQztDQUNGO0FBRUQsa0JBQWUsSUFBSSxpQ0FBaUMsRUFBRSxDQUFDIn0=