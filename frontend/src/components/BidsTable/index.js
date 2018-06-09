import React, {Component, Fragment} from 'react';
import { Table } from 'semantic-ui-react';

export default class BidsTable extends Component {

    render() {
        return (
                <Fragment>
                    Ask
                    <Table celled>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Price</Table.HeaderCell>
                                <Table.HeaderCell>Amount</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                        {this.props.sellSide.map(function(bid){
                            return <Table.Row key={bid.pkey}>
                                        <Table.Cell>{bid.price}</Table.Cell>
                                        <Table.Cell>{bid.amount}</Table.Cell>
                                      </Table.Row>;
                        })}
                        </Table.Body>
                    </Table>
                    Buy
                    <Table celled>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Price</Table.HeaderCell>
                                <Table.HeaderCell>Amount</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                        {this.props.buySide.map(function(bid){
                            return <Table.Row key={bid.pkey}>
                                        <Table.Cell>{bid.price}</Table.Cell>
                                        <Table.Cell>{bid.amount}</Table.Cell>
                                      </Table.Row>;
                        })}
                        </Table.Body>
                    </Table>
                </Fragment>
                );
    }
}