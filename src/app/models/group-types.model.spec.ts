import {
  GroupTypeMapper,
  GroupTypeUI,
  GroupTypeService
} from "./group-types.model";

describe('Unit Test :: Group type model', () => {
  it('should execute the canary test', () => {
    return expect(true).toBe(true)
  });

  it('should correctly convert to UI model - 1', () => {
    const gtm = new GroupTypeMapper();
    const input: GroupTypeService = {
      attributes: {
        bucket: "portfolio",
        icon: "fa fa-suitcase",
        level: [0, 1],
        name: "Portfolio",
        sublevel: 3,
        group: "portfolio",
        ['show-in-sidebar']: true
      },
      id: 'gt_01',
      links: {
        related: 'some_link'
      },
      relationships: {
        typeList: {
          data: [{
            id: "b9a71831-c803-4f66-8774-4193fffd1311",
            workitemtype: "type-1"
          }]
        }
      },
      type: 'grouptype'
    };
    const output: GroupTypeUI = gtm.toUIModel(input);
    const expectedOutput: GroupTypeUI = {
      id: 'gt_01',
      name: "Portfolio",
      bucket: "portfolio",
      level: [0, 1],
      icon: "fa fa-suitcase",
      sublevel: 3,
      group: "portfolio",
      selected: false,
      showInSideBar: true,
      infotipTextMap: { 
        'Scenarios': 'A software development methodology focused on real-world problems, or scenarios, described in the language and from the viewpoint of the user. Scenarios deliver particular value propositions and are realized through experiences.',
        'Experiences': 'Experience describes the envisioned user experience in the product to actualize a parent work item. Each parent work item can have multiple experiences.',
        'Requirements': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
      },
      typeList: [{
        id: "b9a71831-c803-4f66-8774-4193fffd1311",
        workitemtype: "type-1"
      }]
    };
    return expect(expectedOutput).toEqual(output);
  });

  // it('should correctly convert to Service model - 1', () => {
  //   const gtm = new GroupTypeMapper();
  //   const input: GroupTypeUI = {
  //     id: 'gt_01',
  //     name: "Portfolio",
  //     bucket: "portfolio",
  //     level: [0, 1],
  //     icon: "fa fa-suitcase",
  //     sublevel: 3,
  //     group: "portfolio",
  //     selected: false,
  //     showInSideBar: true,
  //     typeList: [{
  //       id: "b9a71831-c803-4f66-8774-4193fffd1311",
  //       workitemtype: "type-1"
  //     }]
  //   };
  //   const output: GroupTypeService = gtm.toServiceModel(input);
  //   const expectedOutput: GroupTypeService  = {
  //     attributes: {
  //       bucket: "portfolio",
  //       icon: "fa fa-suitcase",
  //       level: [0, 1],
  //       name: "Portfolio",
  //       sublevel: 3,
  //       group: "portfolio",
  //       ['show-in-sidebar']: true
  //     },
  //     id: 'gt_01',
  //     links: {
  //       related: 'some_link'
  //     },
  //     relationships: {
  //       typeList: {
  //         data: [{
  //           id: "b9a71831-c803-4f66-8774-4193fffd1311",
  //           workitemtype: "type-1"
  //         }]
  //       }
  //     },
  //     type: 'grouptype'
  //   };
  //   return expect(expectedOutput).toEqual(output);
  // });
})
