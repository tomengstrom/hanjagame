import * as _ from "lodash";
import { NodeModel, DiagramEngine } from "storm-react-diagrams";

import { DiamondPortModel } from "./DiamondPortModel";

export class DiamondNodeModel extends NodeModel {

	languageArgs: object

	constructor() {
		super("diamond");

		this.languageArgs = {
			type: "narrativenode"
		};

		this.addPort(new DiamondPortModel("top"));
		this.addPort(new DiamondPortModel("left"));
		this.addPort(new DiamondPortModel("bottom"));
		this.addPort(new DiamondPortModel("right"));
	}

	serialize() {
		return _.merge(super.serialize(), {
			languageArgs: this.languageArgs
		});
	}

	deSerialize(data: any, engine: DiagramEngine) {
		super.deSerialize(data, engine);
		this.languageArgs = data.languageArgs;
	}

}
