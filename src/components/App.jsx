import React, { Component } from 'react';
import css from './App.module.css';
import ContactForm from './ContactForm/ContactForm';
import ContactList from './ContactList/ContactList';
import Section from './Section/Section';
import Filter from './Filter/Filter';
import { nanoid } from 'nanoid';

const INITIAL_STATE = {
  contacts: [
    { id: nanoid(), name: 'Rosie Simpson', number: '459-12-56' },
    { id: nanoid(), name: 'Hermione Kline', number: '443-89-12' },
    { id: nanoid(), name: 'Eden Clements', number: '645-17-79' },
    { id: nanoid(), name: 'Annie Copeland', number: '227-91-26' },
  ],
  filter: '',
};

class App extends Component {
  state = INITIAL_STATE;

  handleSubmit = event => {
    event.preventDefault();

    const name = event.target.name.value;
    const number = event.target.number.value;

    const newContact = { id: nanoid(), name: name, number: number };

    if (
      this.state.contacts.find(
        contact => contact.name.toLowerCase() === newContact.name.toLowerCase()
      )
    ) {
      return alert(`${name} is already in contacts`);
    } else {
      this.setState(
        {
          contacts: [...this.state.contacts, ...[newContact]],
        },
        () => {
          event.target.name.value = '';
          event.target.number.value = '';
        }
      );
    }
  };

  handleDelete = id => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(contact => contact.id !== id),
    }));
  };

  filterOnChange = event => {
    const enteredValue = event.target.value;

    this.setState({
      filter: enteredValue,
    });
  };

  filterContacts = () => {
    const filter = this.state.filter;
    const allContacts = this.state.contacts;

    const filteredContacts = allContacts.filter(contact =>
      contact.name.toLowerCase().includes(filter.toLowerCase())
    );

    return filteredContacts;
  };

  componentDidMount() {
    const localStorageContacts = JSON.parse(localStorage.getItem('contacts'));

    if (localStorageContacts) {
      this.setState({ contacts: localStorageContacts });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.contacts.length !== this.state.contacts.length) {
      localStorage.setItem('contacts', JSON.stringify(this.state.contacts));
    }
  }

  render() {
    const filtered = this.filterContacts();
    return (
      <div className={css.app}>
        <Section tittle="Phonebook">
          <ContactForm handleSubmit={this.handleSubmit} />
        </Section>
        <Section tittle="Contacts">
          <Filter filterOnChange={this.filterOnChange} />
          <ContactList data={filtered} handleDelete={this.handleDelete} />
        </Section>
      </div>
    );
  }
}

export default App;
