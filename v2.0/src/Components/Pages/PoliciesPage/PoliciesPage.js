import React from 'react';
import CONST from '../../Constants';
import LoadingCircle from '../../Shared/LoadingCircle';
import PageTitle from '../../Shared/PageTitle';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';

class PoliciesPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageData: null
        }
    }
    componentDidMount() {
        fetch(CONST.URL.POLICIES).then(data => {
            return data.json()
        }).then(myJson => {
            this.setState({
                pageData: myJson.pageData
            });
        }).catch(error => {
            console.log(error);
            return null;
        });
    }

    render() {
        if(!this.state.pageData) return <LoadingCircle/>;
        return (
            <div className='boxed-wrapper'>
                <div className="container p-5">
                    <PageTitle>Policies</PageTitle>
                    <Accordion>
                        {this.renderPolicies(this.state.pageData)}
                    </Accordion>
                </div>
            </div>
        );
    }

    renderPolicies(policies) {
        return Object.entries(policies).map((policy, index) => {
            return (
                <Card key={policy[0]}>
                    <Accordion.Toggle as={Card.Header} eventKey={index}>
                    {policy[0]}
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey={index}>
                    <Card.Body dangerouslySetInnerHTML={{__html: policy[1]}}></Card.Body>
                    </Accordion.Collapse>
                </Card>
            );
        });
    }
}

export default PoliciesPage;