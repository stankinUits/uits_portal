

export class Subject {
    id: number;
    name: string;
    description: string;

    constructor(id: number, name: string, description: string) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    static fromResponse(raw_subject: any): Subject {
        return new Subject(
            raw_subject.id,
            raw_subject.name,
            raw_subject.description
        );
    }
}
