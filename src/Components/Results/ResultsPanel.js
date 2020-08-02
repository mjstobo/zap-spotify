import React from "react";
import SpotifyResultsTile from './SpotifyResultsTile'

class ResultsPanel extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            result: this.props.result,
        }
      }

      componentDidMount() {
          this.generateResultsTiles(this.props.result);
          console.log(this.props.playlistId)
      }

      componentDidUpdate(prevProps) {
          if(prevProps.result !== this.props.result){
             console.log(this.props.result)
            this.generateResultsTiles(this.props.result);
          }
      }


      generateResultsTiles = (searchResults) => {
        let tilesList = searchResults.map((result, index) => (
          <SpotifyResultsTile key={index} result={result} type='subresult' playlistId={this.props.playlistId} />
        ));
        this.setState({
          resultsList: tilesList,
        });
      };
    

  render() {
    return (
      <div className="keyword-subresults">
          {this.props.showResults ? this.state.resultsList : ''}
      </div>
    );
  }
}

export default ResultsPanel;
