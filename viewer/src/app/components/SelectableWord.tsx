import * as React from 'react';

interface SelectableWordProps {
    word: string
    parent: any
    option: any
}
interface SelectableWordState {
}
export class SelectableWord extends React.Component<SelectableWordProps, SelectableWordState> {
    
    constructor(props: SelectableWordProps) {
        super(props);
    }

    click() {
        this.props.parent.selected(this);
    }

    render() {
        return (
            <div
                onClick={this.click.bind(this)}
                className="selectable-word"
                data-selected={this.props.parent.state.selected_word == this}>{this.props.word}</div>
        )
    }

}