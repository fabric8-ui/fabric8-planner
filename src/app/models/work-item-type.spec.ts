import {
  WorkItemTypeMapper,
  WorkItemTypeUI,
  WorkItemTypeService,
  WorkItemTypeField
} from './work-item-type';

describe('WorkItemTypeMapper', () => {
    let workItemTypeMapper: WorkItemTypeMapper;
    let workItemTypeUI: WorkItemTypeUI;
    let workItemTypeService: WorkItemTypeService;


    workItemTypeUI = {
        id: '',
        name: '',
        icon: '',
        version: 0,
        description: '',
        childTypes: [
          {id: "bbf35418-04b6-426c-a60b-7f80beb0b624", type: "workitemtypes"},
          {id: "26787039-b68f-4e28-8814-c2f93be1ef4e", type: "workitemtypes"}
        ],
        fields: {
          "system.area": {
            "description": "The area to which the work item belongs",
            "label": "Area",
            "required": false,
            "type": {
              "kind": "area"
            }
          }
        },
        infotipTextMap: { 
          'Scenario': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          'Fundamental': 'Work item type that focuses on getting the basic foundations of a product right to make it more efficient.',
          'Papercuts': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          'Experience': 'Experience describes the envisioned user experience in the product to actualize a parent work item. Each parent work item can have multiple experiences.',
          'Value Proposition': 'Work item type that states the value provided to the user by addressing a parent work item. Each parent work item can have multiple value propositions.',
          'Feature': 'A feature is a detailed user-story that helps actualize parent experiences. It can support multiple experiences and is generally achievable within a sprint.',
          'Bug': 'Defect that causes unexpected behavior in the software.',
          'Task': 'Work assigned to various team members to implement a feature. They are generally measured in units of 0.5 days, for example, four hours, eight hours, sixteen hours.'
       },
        type: 'workitemtypes'
    } as WorkItemTypeUI;

    workItemTypeService = {
      id: '',
      type: 'workitemtypes',
      attributes: {
          name: '',
          version: 0,
          description: '',
          icon: '',
          fields: {
            "system.area": {
              "description": "The area to which the work item belongs",
              "label": "Area",
              "required": false,
              "type": {
                "kind": "area"
              }
            }
          }
      },
      relationships: {
        guidedChildTypes: {
          data: [
            {id: "bbf35418-04b6-426c-a60b-7f80beb0b624", type: "workitemtypes"},
            {id: "26787039-b68f-4e28-8814-c2f93be1ef4e", type: "workitemtypes"}
          ]
        }
      }
    } as WorkItemTypeService

    beforeEach(() => {
        workItemTypeMapper = new WorkItemTypeMapper();
    });

    it('should execute the canary test', () => {
        return expect(true).toBe(true)
      });

    it('should correctly convert to service model - 1', () => {
        expect(workItemTypeMapper.toServiceModel(workItemTypeUI)).toEqual(workItemTypeService);
    });

    it('should correctly convert to UI model - 2', () => {
        expect(workItemTypeMapper.toUIModel(workItemTypeService)).toEqual(workItemTypeUI);
    });
});
