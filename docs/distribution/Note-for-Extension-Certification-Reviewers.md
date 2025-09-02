### Extension Purpose and Permissions

#### Single Purpose
**单一用途说明 (Single Purpose Description):**
This extension has a single, specific purpose: to copy mathematical formulas from web pages in various formats (LaTeX, MathML) for academic and research use. Users can click on any mathematical formula on supported platforms to copy it to their clipboard, enabling easy transfer of mathematical expressions to documents, presentations, or other applications.

#### Permission Justifications

**activeTab Permission (0/1,000 characters):**
The activeTab permission is essential for this extension to access the currently active tab's content and identify mathematical formulas. This permission is required to read the DOM content of the page where the user wants to copy formulas. Without this permission, the extension cannot function as it needs to detect and interact with mathematical expressions on the webpage.

**storage Permission (0/1,000 characters):**
The storage permission is necessary to save user preferences such as the default output format (LaTeX or MathML), API keys for premium features, and user settings. This ensures that users don't need to reconfigure the extension every time they use it, providing a consistent and personalized experience.

**Host Permissions (0/1,000 characters):**
Host permissions are required to access mathematical formulas on various educational and research platforms including ArXiv, Zhihu, and AI chat platforms. These permissions allow the extension to read page content and identify mathematical expressions that users want to copy. The extension only requests access to specific domains where mathematical content is commonly found.

### Important Notes for Reviewers

- **Single Purpose Compliance**: The extension maintains a clear, focused purpose of mathematical formula copying without additional features that could confuse users.
- **Minimal Permissions**: All requested permissions are essential for the core functionality and cannot be reduced without breaking the extension's purpose.
- **User Privacy**: The extension does not collect personal data and only processes mathematical content for copying purposes.
- **Security**: No sensitive information is transmitted or stored beyond what is necessary for the extension's operation.

Thank you for installing and testing our DeepShare browser extension. Designed specifically for AI users, we strive to provide the best conversation sharing and export experience, especially for handling mathematical formulas.

Email us at: yoricker@foxmail.com