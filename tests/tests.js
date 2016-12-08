var assert = require('assert'),
    textChanger = require('./tests/fixtures/text-changer.js');

describe('TextChanger', function() {
    var element = document.createElement('section');
    element.appendChild(
        document.createElement('span')
            .appendChild(
                document.createTextNode('Replace me')
            )
    );

    describe('#changeText(element, text)', function() {
        it('should replace the content of the element with given text', function() {
            textChanger().replaceText(element, 'test');
            assert.equal(element.childNodes[0].nodeValue, 'test');
        });

        it('should throw an error if element is not a DOM element', function() {
            assert.throws(function() {
                textChanger().replaceText(null, 'test')
            }, /DOM element/);
        });
    });
});