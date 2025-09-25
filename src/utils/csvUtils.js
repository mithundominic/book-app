import Papa from 'papaparse';
import { faker } from '@faker-js/faker';

export const COLUMNS = ['Title', 'Author', 'Genre', 'PublishedYear', 'ISBN'];

export const generateFakeData = (count = 10000) => {
  const genres = [
    'Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Science Fiction',
    'Fantasy', 'Thriller', 'Biography', 'History', 'Self-Help',
    'Business', 'Health', 'Travel', 'Cooking', 'Art'
  ];

  return Array.from({ length: count }, (_, index) => ({
    id: `row-${index}`,
    Title: faker.book.title(),
    Author: faker.book.author(),
    Genre: faker.helpers.arrayElement(genres),
    PublishedYear: faker.date.between({ from: '1950-01-01', to: '2024-12-31' }).getFullYear().toString(),
    ISBN: faker.commerce.isbn(13),
  }));
};

export const parseCSV = (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error(results.errors[0].message));
          return;
        }

        const data = results.data.map((row, index) => ({
          id: `row-${index}`,
          Title: row.Title || '',
          Author: row.Author || '',
          Genre: row.Genre || '',
          PublishedYear: row.PublishedYear || '',
          ISBN: row.ISBN || '',
        }));

        resolve(data);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

export const exportToCSV = (data, filename = 'exported-data.csv') => {
  const csv = Papa.unparse(data.map(({ id, ...rest }) => rest));
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const filterData = (data, searchTerms) => {
  return data.filter(row => {
    return Object.entries(searchTerms).every(([column, term]) => {
      if (!term) return true;
      const value = row[column]?.toString().toLowerCase() || '';
      return value.includes(term.toLowerCase());
    });
  });
};