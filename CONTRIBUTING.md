# Contributing to Harmonia

Thank you for your interest in contributing to Harmonia! This document provides guidelines and instructions for contributing.

## 🤝 How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Your environment (OS, browser, Node/Python versions)

### Suggesting Features

We welcome feature suggestions! Please:
- Check if the feature has already been suggested
- Provide a clear description of the feature
- Explain the use case and benefits
- Include mockups or examples if possible

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Follow the existing code style
   - Add comments for complex logic
   - Update documentation if needed

4. **Test your changes**
   - Frontend: `npm run build` to ensure it builds
   - Backend: Test API endpoints manually

5. **Commit your changes**
   ```bash
   git commit -m "Add: amazing feature"
   ```
   
   Use conventional commits:
   - `Add:` for new features
   - `Fix:` for bug fixes
   - `Update:` for updates to existing features
   - `Docs:` for documentation changes
   - `Style:` for formatting changes
   - `Refactor:` for code refactoring

6. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

7. **Create a Pull Request**
   - Provide a clear description
   - Reference any related issues
   - Include screenshots for UI changes

## 🏗️ Development Setup

### Prerequisites
- Node.js 18+
- Python 3.9+
- Git

### Setup Instructions

1. Clone your fork:
   ```bash
   git clone https://github.com/your-username/harmonia.git
   cd harmonia
   ```

2. Run the setup script:
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

3. Start development:
   ```bash
   # Terminal 1 - Backend
   cd backend
   source venv/bin/activate
   python run.py

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

## 📝 Code Style Guidelines

### Frontend (JavaScript/React)
- Use functional components with hooks
- Use arrow functions
- Use meaningful variable names
- Keep components small and focused
- Add PropTypes or TypeScript types
- Use Tailwind CSS classes

### Backend (Python)
- Follow PEP 8 style guide
- Use type hints where appropriate
- Add docstrings to functions and classes
- Keep functions small and focused
- Handle errors gracefully

### Git Commit Messages
- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit first line to 72 characters
- Reference issues and pull requests

## 🎯 Areas We Need Help

- [ ] Improving audio processing algorithms
- [ ] Adding more therapeutic frequencies
- [ ] Mobile responsiveness improvements
- [ ] Performance optimizations
- [ ] Documentation improvements
- [ ] Translation to other languages
- [ ] Testing and bug reports

## 📚 Resources

- [React Documentation](https://react.dev)
- [Flask Documentation](https://flask.palletsprojects.com)
- [Librosa Documentation](https://librosa.org/doc/latest/index.html)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🙋 Questions?

Feel free to open an issue for questions or join our community discussions.

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Harmonia! 🎵✨
