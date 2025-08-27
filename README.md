# pedantix-meta

**pedantix-meta** is a project designed to solve the Wikipedia word-guessing game automatically. Its goal is to predict the words of the day’s Wikipedia page introduction and identify the page itself.

## Game Context

The game works as follows:

- Correctly guessed words appear in plain text.
- Words that are semantically close appear in gray, with the shade proportional to their similarity to the actual word (similar to the approach used by Cémantix).
- The length of a hidden word can be revealed by pressing its black box.
- Once all words forming the Wikipedia page title are revealed, the player wins.
- Singular or infinitive forms can reveal plural, feminine, or conjugated forms. Capitalization is not required.

## Project Goals

- **pedantix-meta** is **not a game**, but a solver aiming to discover the Wikipedia page of the day automatically.
- Current implementation guesses words at random.
- Future versions aim to solve the page using only the number of letters in each word, minimizing random guesses.

## Algorithm

The solver works in the following way (planned/future approach):

1. **Word Analysis**: Analyze the length of each hidden word.
2. **Candidate Generation**: Generate candidate words based on length and semantic similarity.
3. **Prediction**: Use semantic proximity to suggest guesses likely to reveal the word.
4. **Iterative Refinement**: Update predictions based on feedback from previous guesses (correct, gray, or incorrect).
5. **Title Identification**: Once the title words are revealed, determine the exact Wikipedia page.

## Limitations

- Currently, guesses are random; there is no intelligent strategy implemented yet.
- Semantic similarity calculations are simplified and do not yet account for all grammatical variations.
- Solver performance is highly dependent on the number of attempts and word length information.

## Future Work

- Implement a strategy using only word lengths to narrow down candidates.
- Integrate more advanced semantic models to improve proximity guesses.
- Optimize for fewer attempts while increasing the probability of solving the page correctly.
- Explore reinforcement learning approaches to learn efficient guessing strategies.

## Additional Notes

- Players typically need more than 6 attempts—often dozens—to discover the page manually.
- Rankings in the game are independent of the number of attempts.
- A new Wikipedia page is selected at random every day at 12:00 PM French time (11:00 AM local time).

## License

This project is [MIT licensed](LICENSE).
