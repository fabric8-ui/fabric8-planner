import { Injectable, Component, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpService } from './http-service';
import { InfotipState } from './../states/infotip.state';

const infotipsUrl: string = 'https://docs.openshift.io/json/infotips.json';
//const infotipsUrl: string = 'https://raw.githubusercontent.com/fabric8io/fabric8-online-docs/master/json/infotips.json';

// const infotipsMap = 
// {
//   "6cff4ab8-c380-4aa9-9980-17b6f223d181": {
//     term: "alternate dependency",
//     en_EN: "Dependencies recommended by OpenShift.io to replace restrictive licenses or usage outliers."
//   },

//   "a99bf72a-baf4-436e-8095-3955e39d5af0": {
//     term: "area",
//     en_EN: "Use areas to organize work items to distinguish between different types or functionalities that are being worked on within a space."
//   },
  
//   "d6c3bc51-f623-4aa4-bea4-4e1d68a27661": {
//     term: "backlog",
//     en_EN: "A backlog is a list of work items that have not been triaged and assigned to a specific iteration."
//   },

//   "e8d54bf3-f89e-46e5-86f7-4af6475863b0": {
//     term: "bug",
//     en_EN: "A defect that causes unexpected behavior in the software and that needs to be fixed."
//   },
    
//   "1694e637-2f9b-40ec-8fa8-a22472850ff9": {
//     term: "companion dependency",
//     en_EN: "Based on the analysis of your stack, {osio} suggests additional dependencies that can add value to your stack."
//   },

//   "23c322f1-53b1-4286-b524-37ab58124823": {
//     term: "experience",
//     en_EN: "An experience is a way to address a scenario, fundamental, or a set of papercuts, each of which often have multiple realizing experiences. Often written as a demonstration script, it describes the ideal end-user work flow for realizing one or more of the associated value propositions."
//   },

//   "9ee45d71-1efe-4fec-b1bb-ac92563327a6": {
//     term: "experiences",
//     en_EN: "Work item type group that focuses on the experience and value proposition work item types that address the scenarios."
//   },

//   "dbfc82e1-5a40-44bd-af70-f2dc1a1927a4": {
//     term: "feature",
//     en_EN: "Features, often expressed as user stories, are required to actualize parent experiences. They are scoped so that they are generally achievable within a sprint."
//   },

//   "4d85adba-817d-41ca-b85f-1e4a938d1282": {
//     term: "fundamental",
//     en_EN: "A fundamental describes the basic essentials of a software product, such as quality and performance standards. It is a non-negotiable aspect of a product and its absence reduces the value provided to the user."
//   },

//   "5c1b8158-a351-4092-8780-3ad22e1eb173": {
//     term: "iteration",
//     en_EN: "A development cycle used to organize, plan, and execute work items in a certain order. It comprises a logical mix of work items slated to be executed within the time frame of the iteration."
//   },
    
//   "f05a151a-61fa-45b1-8d8b-b3fd7bc63ea9": {
//     term: "license conflict",
//     en_EN: "Licenses that conflict at the stack or dependency level."
//   },

//   "83b7cf12-558e-41bd-bcd7-822ca6307db1": {
//     term: "papercut",
//     en_EN: "A papercut is a minor issue, often too small to be individually prioritized to be addressed; collectively, papercuts degrade the perception of the product. Grouped together, they receive higher priority and can be tackled together within a development cycle."
//   },

//   "5bd840a6-2f62-4bea-bb04-63252f6ce381": {
//     term: "pipeline",
//     en_EN: "Pipelines are a continuous delivery system that, at each step, tests and deploys the code to provide feedback to the user. Examples of such steps are unit testing, performance, integration, and deployment. Each step of the pipeline implements different levels of testing and deployment tasks, provides results, and then passes the code on to the next step."
//   },

//   "3a953b07-0cc3-4b45-b891-bf490216eae3": {
//     term: "restrictive license",
//     en_EN: "Licenses that are not commonly used in similar stacks or that do not work well with the stack’s representative license."
//   },

//   "a0b10d4f-f639-4978-a2e5-6e858a56f6df": {
//     term: "requirements",
//     en_EN: "Work item type group that focuses on execution oriented work item types such as feature, task, and bug."
//   },
    
//   "01e76137-ab89-4a3c-8765-48f54078154a": {
//     term: "scenario",
//     en_EN: "A scenario identifies a real-world user problem to resolve. Addressing the scenario provides tangible user value. Prioritize scenarios that deliver maximum user value by evaluating their associated value propositions."
//   },
    
//   "376d7613-4eaf-425e-a2f2-b434205ebdeb": {
//     term: "scenarios",
//     en_EN: "Work item type group that focuses on the planning oriented work item types such as scenario, fundamental and papercuts."
//   },

//   "eb05f2b6-8a3c-4054-b28c-3eb1a47c125f": {
//     term: "scenario-driven planning",
//     en_EN: "A software development methodology focused on real-world problems, or scenarios, described in the language and from the viewpoint of the user. Scenarios deliver particular value propositions and are realized through experiences."
//   },
  
//   "a5fad1f2-7d5c-4d62-b269-d3637495422a": {
//     term: "security issue",
//     en_EN: "OpenShift.io analyzes the CVEs of all your dependencies and flags the ones with security vulnerabilities."
//   },
    
//   "5c543e22-8ae9-4b66-9112-1513d47ab1b4": {
//     term: "space",
//     en_EN: "A space is the equivalent of a project. Each iteration and work item must be attached to a space, and a team of people can be attached to a space in various roles. By default, a space contains at least one area and one iteration."
//   },
    
//   "cc2d6cb4-7690-4c02-989c-7d75e3419b7d": {
//     term: "task",
//     en_EN: "Work assigned to various team members to implement a feature. They are generally measured in units of 0.5 days, for example, four hours, eight hours, sixteen hours."
//   },
    
//   "0b52988d-9cea-47a6-9769-d677bff95ed3": {
//     term: "unknown license",
//     en_EN: "Licenses unknown to OpenShift.io."
//   },
    
//   "203160dd-cb50-4383-a2d6-84efcd472c98": {
//     term: "usage outlier",
//     en_EN: "Dependencies in your stack that are not commonly used in similar open source stacks or that rarely work well together."
//   },
    
//   "83e52577-cdc4-4687-97d1-86151db74bdc": {
//     term: "value proposition",
//     en_EN: "A statement of the value provided to the user by addressing a scenario, fundamental, or papercut. Each of which can have multiple value propositions."
//   },
    
//   "83e7953e-9335-428c-b1af-7aa4b00cd662": {
//     term: "work item",
//     en_EN: "Work items describe and keep track of work that needs to be completed. They can be assigned to collaborators within a space. Each work item must be attached to a space and an area (assigned by default). This can be used to model bugs, tasks, features, ideas, and more."
//   },
  
//   "e4c8beb4-1ed1-4275-af20-9ee3cb6dafd1": {
//     term: "workspace",
//     en_EN: "Workspaces are fully configured web-based development environments suitable for your code and runtime needs. They are runtime environments where you can modify, test, debug, or run your code."
//   }
// };

@Injectable()
export class InfotipService {
  constructor(
      private http: HttpService
    ) {}

  getInfotips(): Observable<InfotipState> {
    return this.http
      .get(infotipsUrl)
      .map(response => {
        if (/^[5, 4][0-9]/.test(response.status.toString())) {
          throw new Error('API error occured');
        }
        return response.json().data as InfotipState;
      })

    //return Observable.of(infotipsMap);    
  }
}