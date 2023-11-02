import React from 'react';
import LoadingCircle from '../../Shared/LoadingCircle';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import { connect } from 'react-redux';
import BreadCrumbBar from '../../Shared/BreadCrumbBar'
import queryString from 'query-string'
import Seo from '../../Shared/Seo';

class PoliciesPage extends React.Component {
	render() {
		const {community} = this.props
		if (!this.props.policies) return <LoadingCircle />;
		return (
			<>
				{Seo({
				title: 'Policies',
				description: '',
				url: `${window.location.pathname}`,
				site_name: community?.name,
				})}
				<div className='boxed_wrapper'>
					<BreadCrumbBar links={[{ name: 'Policies' }]} />
					<div className="container p-5" style={{height:window.screen.height-200}}>
						<Accordion defaultActiveKey="0">
							{this.renderPolicies(this.props.policies)}
						</Accordion>
					</div>
				</div>
			</>
		);
	}

	renderPolicies(policies) {
		const query = queryString.parse(this.props.location.search);
		if (query && query.name) {
			policies = policies.filter(p => {
				return p.name === query.name;
			});
		}
		return Object.keys(policies).map((key) => {
			const policy = policies[key];
			return (
        <Card key={key}>
          <Accordion.Toggle as={Card.Header} eventKey={key}>
            {policy.name}
          </Accordion.Toggle>
          <Accordion.Collapse eventKey={key}>
            <Card.Body
              dangerouslySetInnerHTML={{ __html: policy.description }}
              className="rich-text-container"
            ></Card.Body>
          </Accordion.Collapse>
        </Card>
      );
		});
	}
}

const mapStoreToProps = (store) => {
	return {
		policies: store.page.policies,
		community: store.page.community,
	}
}
export default connect(mapStoreToProps, null)(PoliciesPage);