import React from 'react';
import URLS, { getJson } from '../../api_v2';
import LoadingCircle from '../../Shared/LoadingCircle';
import PageTitle from '../../Shared/PageTitle';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';

class PoliciesPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false
        }
    }
    componentDidMount() {
        Promise.all([
            getJson(URLS.PAGES + "?name=Policies"),
		]).then(myJsons => {
			this.setState({
                policies: myJsons[0].data[0].sections,
				loaded: true
			})
		}).catch(err => {
			console.log(err)
		});
    }

    render() {
        if(!this.state.loaded) return <LoadingCircle/>;
        return (
            <div className='boxed-wrapper'>
                <div className="container p-5">
                    <PageTitle>Policies</PageTitle>
                    <Accordion>
                        {this.renderPolicies(this.state.policies)}
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
                    {policy[1].name}
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey={index}>
                    <Card.Body dangerouslySetInnerHTML={{__html: policy[1].description}}></Card.Body>
                    </Accordion.Collapse>
                </Card>
            );
        });
    }
}

export default PoliciesPage;