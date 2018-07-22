import 'aframe';

const { AFRAME } = window;

AFRAME.registerComponent('tutorial', {
    schema: {
        currentStep: {
            type: 'number',
            default: -1
        }
    },

    init() {
        this.superHands = document.querySelector('[progressive-controls]');
        this.handleControllerChange = this.handleControllerChange.bind(this);
        this.superHands.addEventListener('controller-progressed', this.handleControllerChange);
        this.tutorialSteps = this.el.querySelectorAll('[tutorial-step]');
        this.handleNextStep = this.handleNextStep.bind(this);
        this.el.addEventListener('next-step', this.handleNextStep);
        this.handleStartTutorial = this.handleStartTutorial.bind(this);
        this.startTutorialButton = document.querySelector('#start-tutorial');
        this.startTutorialButton.addEventListener('clicked', this.handleStartTutorial);
        this.handleControllerChange();
    },

    remove() {
        this.el.sceneEl.removeEventListener('target-selected', this.handleNextStep);
        this.el.removeEventListener('next-step', this.handleNextStep);
        this.startTutorialButton.removeEventListener('clicked', this.handleStartTutorial);
    },

    update(oldData) {
        if (this.data.currentStep !== oldData.currentStep && this.data.currentStep >= 0) {
            this.transition(oldData.currentStep, this.data.currentStep);
        }
    },

    transition(prevStep, nextStep) {
        if (prevStep !== undefined && prevStep >= 0 && this.tutorialSteps[prevStep]) {
            this.tutorialSteps[prevStep].components['tutorial-step'].hide();
        }
        if (this.timer) {
            window.clearTimeout(this.timer);
        }
        if (nextStep < this.tutorialSteps.length) {
            this.timer = window.setTimeout(() => {
                this.tutorialSteps[nextStep].components['tutorial-step'].show();
                this.timer = null;
            }, 300);
        }
    },

    handleStartTutorial() {
        if (this.data.currentStep < 0) {
            this.el.setAttribute('tutorial', 'currentStep', 0);
        }
    },

    handleControllerChange() {
        // gaze, desktop, single point, multipointer
        const progressiveControls = this.superHands.components['progressive-controls'];
        const lvl = progressiveControls.currentLevel.get('right');
        const level = progressiveControls.levels[lvl];
        let controllerType = '';
        if (level === 'gaze') {
            if (!AFRAME.utils.device.checkHeadsetConnected()) {
                controllerType = 'desktop';
            } else {
                controllerType = 'gaze';
            }
        } else if (progressiveControls.currentLevel.size === 1) {
            controllerType = 'singlePointer';
        } else {
            controllerType = 'doublePointer';
        }
        this.determineRelevantSteps(controllerType);
    },

    determineRelevantSteps(controllerType) {
        const tutorialSteps = this.el.querySelectorAll('[tutorial-step]');
        this.tutorialSteps = [];
        for (let i = 0; i < tutorialSteps.length; i += 1) {
            const step = tutorialSteps[i];
            const types = step.getAttribute('tutorial-step').controllerTypes;
            if (types.length === 0 || types.includes(controllerType)) {
                this.tutorialSteps.push(step);
            }
        }
    },

    handleNextStep() {
        let nextStep = (this.data.currentStep + 1);
        if (nextStep > this.tutorialSteps.length) {
            nextStep = -1;
        }
        this.el.setAttribute('tutorial', 'currentStep', nextStep);
    }
});
