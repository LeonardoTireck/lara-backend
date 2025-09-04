import { Document } from '../../../src/domain/Document';

describe('Document (CPF) Value Object', () => {
    describe('Valid CPFs', () => {
        it('should create a valid document from a raw string of numbers', () => {
            const documentValue = '11144477735';
            const document = new Document(documentValue);
            expect(document.value).toBe(documentValue);
        });

        it('should create a valid document from a formatted string', () => {
            const documentValue = '111.444.777-35';
            const document = new Document(documentValue);
            expect(document.value).toBe(documentValue);
        });
    });

    describe('Invalid CPFs', () => {
        it('should throw an error for a document with incorrect length', () => {
            const invalidDocument = '1234567890';
            expect(() => new Document(invalidDocument)).toThrow(
                'Document does not meet criteria.',
            );
        });

        it('should throw an error for a document with all same digits', () => {
            const invalidDocument = '11111111111';
            expect(() => new Document(invalidDocument)).toThrow(
                'Document does not meet criteria.',
            );
        });

        it('should throw an error for a document with an invalid first verification digit', () => {
            const invalidDocument = '11144477745'; // Correct digit is 3
            expect(() => new Document(invalidDocument)).toThrow(
                'Document does not meet criteria.',
            );
        });

        it('should throw an error for a document with an invalid second verification digit', () => {
            const invalidDocument = '11144477736'; // Correct digit is 5
            expect(() => new Document(invalidDocument)).toThrow(
                'Document does not meet criteria.',
            );
        });

        it('should throw an error for a document containing non-digit characters', () => {
            const invalidDocument = '111.444.777-3a';
            expect(() => new Document(invalidDocument)).toThrow(
                'Document does not meet criteria.',
            );
        });

        it('should throw an error for a null value', () => {
            const invalidDocument = null as any;
            expect(() => new Document(invalidDocument)).toThrow();
        });

        it('should throw an error for an undefined value', () => {
            const invalidDocument = undefined as any;
            expect(() => new Document(invalidDocument)).toThrow();
        });
    });
});
