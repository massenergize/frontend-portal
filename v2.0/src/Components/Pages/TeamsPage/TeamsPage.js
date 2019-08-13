import React from 'react'
import { connect } from 'react-redux';
import PageTitle from '../../Shared/PageTitle';
import Tooltip from '../../Shared/Tooltip';
import Table from 'react-bootstrap/Table';
import LoadingCircle from '../../Shared/LoadingCircle';

class TeamsPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {        
        const teams = this.props.teamsPage;
        if(teams == null) return <LoadingCircle/>

        return (
            <div className="boxed_wrapper p-5">
                <PageTitle>Teams Leaderboard</PageTitle>
                <Table bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Team Name</th>
                            <th># Households</th>
                            <th># Actions Completed</th>
                            <th>Average # Actions/Household</th>
                            <th>
                                <Tooltip text="Brad's paragraph here" dir="left">
                                    <span className="has-tooltip">Carbon Impact</span>
                                </Tooltip>
                            </th>
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
        var teamsSorted = teamsData.slice(0);
        for(let i = 0; i < teamsSorted.length; i++) {
            let households = teamsSorted[i].households;
            let actions_completed = teamsSorted[i].actions_completed;
            const avrg =  Number(actions_completed)/Number(households);
            avrg = (!isNaN(avrg)) ? avrg.toFixed(1) : 0;
            teamsSorted[i]["avrgActionsPerHousehold"] = avrg;
        }        

        teamsSorted = teamsSorted.sort((a, b) => {
            return b.avrgActionsPerHousehold - a.avrgActionsPerHousehold;
        });

        return teamsSorted.map((obj) => {
            return (
                <tr>
                    <td>{obj.team.name} &nbsp;
                        <Tooltip title={obj.team.name} text={obj.team.description} dir="right">
                            <span className="fa fa-info-circle" style={{color: "#428a36"}}></span>
                        </Tooltip>
                    </td>
                    <td>{obj.households}</td>
                    <td>{obj.actions_completed}</td>
                    <td>{obj.avrgActionsPerHousehold}</td>
                    {/* <td>{obj.ghgSaved}</td> */}
                </tr>
            )
        });
    }
}
const mapStoreToProps = (store) => {
    return {
        teamsPage: store.page.teamsPage,
    }
}
export default connect(mapStoreToProps, null)(TeamsPage);