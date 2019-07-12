import React from 'react'
import CONST from '../../Constants.js';
import LoadingPage from '../../Shared/LoadingCircle';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

class TeamsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageData: null,
        }
    }
    componentDidMount() {
        fetch(CONST.URL.TEAMS).then(data => {
            return data.json()
        }).then(myJson => {
            this.setState({
                pageData: myJson.pageData,
            });
        }).catch(error => {
            console.log(error);
            return null;
        });
    }

    render() {
        if(!this.state.pageData) return <LoadingPage/>;
        
        const {
            teams
        } = this.state.pageData;

        return (
            <div className="boxed_wrapper p-5">
                <h1 className="text-center pb-3">Teams Leaderboard</h1>
                <Table bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Team Name</th>
                            <th># Households</th>
                            <th># Actions Completed</th>
                            <th>Average # Actions/Household</th>
                            <th>GHG Saved</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderTeamsData(teams)}
                    </tbody>
                </Table>     
            </div>
        );
    }

    renderTeamsData(teamsData) {        
        return teamsData.map((obj) => {
            const popover = (
                <Popover title={obj.teamName}>
                    {obj.teamDescription}
                </Popover>
            );
            return (
                <tr>
                    <td>{obj.teamName} &nbsp;
                        <OverlayTrigger trigger="hover" placement="right" overlay={popover}><span className="fa fa-info-circle"></span></OverlayTrigger>
                    </td>
                    <td>{obj.numHouseholds}</td>
                    <td>{obj.numActionsCompleted}</td>
                    <td>{obj.avrgNumActions}</td>
                    <td>{obj.ghgSaved}</td>
                </tr>
            )
        });
    }
}
export default TeamsPage;