export class BoardModel {
    id: string;
    attributes: {
        name: string;
        description: string;
        contextType: string;  // this designates the type of the context
        context: string;  // this designates the ID of the context, in this case the typegroup ID
        'created-at': string;
        'updated-at': string;
    };
    relationships: {
        spaceTemplate: {
            data: {
                id: string;
                type: 'spacetemplates';
            }
        };
        columns: {
            data: {
                    id: string;
                    type: 'boardcolumns';
                }[];
        };
    };
    included: {
        id: string;
        title: string;
        columnOrder: 0;  // the left-to-right order of the column in the view
        type: 'boardcolumns';
    }[];
    type: 'workitemboards';
}
