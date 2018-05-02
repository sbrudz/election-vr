import 'aframe';
import { format } from 'd3-format';

const { AFRAME } = window;

AFRAME.registerComponent('selection-info', {
    schema: {
        state: {
            type: 'string'
        },
        candidate: {
            type: 'string'
        },
        votes: {
            type: 'number'
        },
        totalVotes: {
            type: 'number'
        },
        percentage: {
            type: 'number'
        }
    },

    init() {
        this.voteFormatter = format(',');
        this.totalVoteFormatter = format('.3s');
        this.percentageFormatter = format('.3p');
    },

    getInfoText() {
        return `${this.data.state}
            ${this.data.candidate}
            ${this.voteFormatter(this.data.votes)} votes
            ${this.percentageFormatter(this.data.percentage)} of ${this.totalVoteFormatter(this.data.totalVotes)} total`;
    }
});
