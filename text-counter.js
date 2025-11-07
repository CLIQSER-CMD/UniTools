// Text Counter Tool JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeTextCounter();
});

function initializeTextCounter() {
    const textInput = document.getElementById('textInput');
    if (textInput) {
        textInput.addEventListener('input', debounce(updateResults, 300));
        // Initial calculation
        updateResults();
    }
}

function updateResults() {
    const text = document.getElementById('textInput').value;
    
    // Basic counts
    const wordCount = countWords(text);
    const charCount = countCharacters(text);
    const charNoSpace = countCharacters(text, true);
    const sentenceCount = countSentences(text);
    const paragraphCount = countParagraphs(text);
    const lineCount = countLines(text);
    
    // Time calculations
    const readingTime = calculateReadingTime(wordCount);
    const speakingTime = calculateSpeakingTime(wordCount);
    
    // Advanced statistics
    const longestWord = findLongestWord(text);
    const avgWordLength = calculateAverageWordLength(text);
    const mostCommonWord = findMostCommonWord(text);
    const uniqueWords = countUniqueWords(text);
    const wordDensity = calculateWordDensity(text);
    
    // Update display
    document.getElementById('wordCount').textContent = wordCount.toLocaleString();
    document.getElementById('charCount').textContent = charCount.toLocaleString();
    document.getElementById('charNoSpace').textContent = charNoSpace.toLocaleString();
    document.getElementById('sentenceCount').textContent = sentenceCount.toLocaleString();
    document.getElementById('paragraphCount').textContent = paragraphCount.toLocaleString();
    document.getElementById('lineCount').textContent = lineCount.toLocaleString();
    document.getElementById('readingTime').textContent = formatTime(readingTime);
    document.getElementById('speakingTime').textContent = formatTime(speakingTime);
    
    document.getElementById('longestWord').textContent = longestWord || '-';
    document.getElementById('avgWordLength').textContent = avgWordLength.toFixed(1);
    document.getElementById('mostCommonWord').textContent = mostCommonWord || '-';
    document.getElementById('uniqueWords').textContent = uniqueWords.toLocaleString();
    document.getElementById('wordDensity').textContent = wordDensity.toFixed(1) + '%';
}

function countWords(text) {
    if (!text.trim()) return 0;
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

function countCharacters(text, noSpaces = false) {
    if (noSpaces) {
        return text.replace(/\s/g, '').length;
    }
    return text.length;
}

function countSentences(text) {
    if (!text.trim()) return 0;
    // Split by sentence endings, but be more sophisticated
    const sentences = text
        .split(/[.!?]+/)
        .map(s => s.trim())
        .filter(s => s.length > 0);
    return sentences.length;
}

function countParagraphs(text) {
    if (!text.trim()) return 0;
    return text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
}

function countLines(text) {
    if (!text) return 0;
    return text.split('\n').length;
}

function calculateReadingTime(wordCount) {
    // Assuming 200 words per minute average reading speed
    return (wordCount / 200) * 60; // Return seconds
}

function calculateSpeakingTime(wordCount) {
    // Assuming 150 words per minute average speaking speed
    return (wordCount / 150) * 60; // Return seconds
}

function findLongestWord(text) {
    if (!text.trim()) return '';
    const words = text.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 0);
    
    if (words.length === 0) return '';
    
    let longest = words[0];
    for (const word of words) {
        if (word.length > longest.length) {
            longest = word;
        }
    }
    
    // Return the original case version if possible
    const originalWords = text.split(/\s+/);
    for (const originalWord of originalWords) {
        if (originalWord.toLowerCase().replace(/[^\w]/g, '') === longest) {
            return originalWord;
        }
    }
    return longest;
}

function calculateAverageWordLength(text) {
    if (!text.trim()) return 0;
    const words = text
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 0);
    
    if (words.length === 0) return 0;
    
    const totalLength = words.reduce((sum, word) => sum + word.length, 0);
    return totalLength / words.length;
}

function findMostCommonWord(text) {
    if (!text.trim()) return '';
    
    // Clean and normalize text
    const words = text
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 0 && !isStopWord(word));
    
    if (words.length === 0) return '';
    
    // Count word frequencies
    const wordCount = {};
    words.forEach(word => {
        wordCount[word] = (wordCount[word] || 0) + 1;
    });
    
    // Find most common word
    const mostCommon = Object.keys(wordCount).reduce((a, b) => 
        wordCount[a] > wordCount[b] ? a : b
    );
    
    // Return original case version if possible
    const originalWords = text.split(/\s+/);
    for (const originalWord of originalWords) {
        if (originalWord.toLowerCase().replace(/[^\w]/g, '') === mostCommon) {
            return originalWord;
        }
    }
    return mostCommon;
}

function isStopWord(word) {
    // Simple stop words list (can be expanded)
    const stopWords = new Set([
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
        'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does',
        'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this',
        'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'my', 'your',
        'his', 'her', 'its', 'our', 'their', 'me', 'him', 'her', 'us', 'them'
    ]);
    return stopWords.has(word);
}

function countUniqueWords(text) {
    if (!text.trim()) return 0;
    const words = text
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 0);
    
    const uniqueWords = new Set(words);
    return uniqueWords.size;
}

function calculateWordDensity(text) {
    if (!text.trim()) return 0;
    const words = text
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 0);
    
    if (words.length === 0) return 0;
    
    const wordCount = {};
    words.forEach(word => {
        wordCount[word] = (wordCount[word] || 0) + 1;
    });
    
    const totalWords = words.length;
    let topWordCount = 0;
    
    // Find count of most common word
    Object.values(wordCount).forEach(count => {
        if (count > topWordCount) {
            topWordCount = count;
        }
    });
    
    return (topWordCount / totalWords) * 100;
}

function formatTime(seconds) {
    if (seconds < 60) {
        return Math.round(seconds) + ' sec';
    } else if (seconds < 3600) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.round(seconds % 60);
        return minutes + ' min ' + remainingSeconds + ' sec';
    } else {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return hours + ' hr ' + minutes + ' min';
    }
}

function clearText() {
    document.getElementById('textInput').value = '';
    updateResults();
}

function loadSample() {
    const sampleText = `The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet, making it useful for testing fonts, keyboards, and other applications.

This is a longer text to demonstrate the capabilities of the text counter tool. It includes multiple sentences, paragraphs, and various types of content to show how the statistics are calculated.

Text analysis is an important part of content creation, whether you're writing for social media, academic purposes, or professional communications. Understanding the length and complexity of your text can help you optimize it for your intended audience and purpose.

Our text counter tool provides comprehensive statistics including word count, character count with and without spaces, sentence count, paragraph count, line count, reading time, speaking time, and detailed linguistic analysis such as word frequency and density.`;
    
    document.getElementById('textInput').value = sampleText;
    updateResults();
}

function downloadResults() {
    const text = document.getElementById('textInput').value;
    const results = {
        timestamp: new Date().toISOString(),
        originalText: text,
        statistics: {
            words: document.getElementById('wordCount').textContent,
            characters: document.getElementById('charCount').textContent,
            charactersNoSpaces: document.getElementById('charNoSpace').textContent,
            sentences: document.getElementById('sentenceCount').textContent,
            paragraphs: document.getElementById('paragraphCount').textContent,
            lines: document.getElementById('lineCount').textContent,
            readingTime: document.getElementById('readingTime').textContent,
            speakingTime: document.getElementById('speakingTime').textContent,
            longestWord: document.getElementById('longestWord').textContent,
            averageWordLength: document.getElementById('avgWordLength').textContent,
            mostCommonWord: document.getElementById('mostCommonWord').textContent,
            uniqueWords: document.getElementById('uniqueWords').textContent,
            wordDensity: document.getElementById('wordDensity').textContent
        }
    };
    
    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'text-counter-results.json';
    link.click();
    
    URL.revokeObjectURL(url);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}