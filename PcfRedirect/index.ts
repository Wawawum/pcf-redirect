import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { PcfRedirectLoading } from './PcfRedirectLoading';
import * as React from 'react';
import { createRoot } from 'react-dom/client';

const CONSTANTS = {
    DEFAULT_DELAY: 500
};

export class PcfRedirect implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private _container: HTMLDivElement;
    private _timeoutId: number | null = null;

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement): void {
        this._container = container;
    }


    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void {
        const url = context.parameters.url?.raw;
        let delay = context.parameters.delay?.raw;

        if (url !== null) {
            if (delay === null || delay < 0)
                delay = CONSTANTS.DEFAULT_DELAY;

            this.clearTimeout();

            this._timeoutId = window.setTimeout(() => { window.location.assign(url) }, delay);

            const root = createRoot(this._container);
            root.render(React.createElement(PcfRedirectLoading));
        }
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs {
        return {};
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {

        this.clearTimeout();
    }

    /**
     * Clears the delay timeout if it has been set.
     */
    private clearTimeout(): void {
        if (this._timeoutId !== null) {
            window.clearTimeout(this._timeoutId);
        }
    }
}
