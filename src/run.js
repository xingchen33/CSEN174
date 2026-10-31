// keeps track of all the stages
//and if we want certain metadata(i.e. damage dealt across all stages)
import Stage from "./stage.js"
import Player from "./player.js"
export default class Run {
  /**
   * @param {string} preset - Which deck preset the run was started with
   * @param {number} difficulty - Which difficulty setting to use
   */
  stages_list = []
  constructor (stages){
    this.stages_list = stages;
  }

  addStage(stage){
    if(!stage instanceof Stage){
      throw new Error("Not a stage");
    }
    this.stages_list.push(stage);
  }

}
