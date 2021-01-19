import { EventManger, DomEventType } from 'common/utility/EventManger';
import { StateManger } from 'common/utility/StateManger';

export class UndoRedo {
    onNext: (stateId: string, stateData: any, step: number) => any;

    onPre: (stateId: string, stateData: any, step: number) => any;

    stateManager: StateManger;

    eventManager: EventManger;

    currentStep: number = 0;

    currentStateId: string;

    subToolId: string;

    constructor(stateManager: StateManger, eventManager: EventManger, subToolId: string) {
        this.stateManager = stateManager;
        this.eventManager = eventManager;
        this.subToolId = subToolId;
    }

    registerCallback(next: (stateId: string, stateData: any, step: number) => any, pre: (stateId: string, stateData: any, step: number) => any) {
        this.onNext = next;
        this.onPre = pre;
    }

    gotoPrev() {
        if (this.hasPreStep()) {
            this.currentStep = this.currentStep - 1;
            const state = this.stateManager.getPreState(this.subToolId, this.currentStateId);
            this.currentStateId = state.stateId;
            this.onPre(this.currentStateId, state, this.currentStep);
        }
    }

    gotoNext() {
        if (this.hasNextStep()) {
            this.currentStep = this.currentStep + 1;
            const state = this.stateManager.getNextState(this.subToolId, this.currentStateId);
            this.currentStateId = state.stateId;
            this.onNext(this.currentStateId, state, this.currentStep);
        }
    }

    hasNextStep(): boolean {
        const count = this.stateManager.getStateCount(this.subToolId);
        return this.currentStep < count;
    }

    hasPreStep(): boolean {
        return this.currentStep > 1;
    }

    addStep(statData: any) {
        this.stateManager.deleteFrom(this.subToolId, this.currentStateId);
        this.currentStateId = this.stateManager.addState(this.subToolId, statData);
        if (this.currentStep > 20) {
            this.stateManager.shift(this.subToolId);
        } else {
            this.currentStep++;
        }
    }

    clearStep() {
        this.currentStep = 0;
        this.currentStateId = null;
        this.stateManager.clearState(this.subToolId);
    }
}
