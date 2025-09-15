// Enhanced Smart Sort Analyzer - COMPLETELY FIXED VERSION
document.addEventListener('DOMContentLoaded', () => {

    // --- DOM ELEMENTS ---
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const listInput = document.getElementById('list-input');
    const generateRandomBtn = document.getElementById('generate-random-btn');
    const analyzeSortBtn = document.getElementById('analyze-sort-btn');
    const pauseResumeBtn = document.getElementById('pause-resume-btn');
    const restartBtn = document.getElementById('restart-btn');
    const speedSlider = document.getElementById('speed-slider');

    // Mode selector elements
    const modeBtns = document.querySelectorAll('.mode-btn');
    const comparisonSelectors = document.getElementById('comparison-selectors');
    const algorithm1Select = document.getElementById('algorithm1-select');
    const algorithm2Select = document.getElementById('algorithm2-select');

    // Data generation buttons
    const genBtns = document.querySelectorAll('.gen-btn');

    // Visualization containers
    const singleViz = document.getElementById('single-viz');
    const compareViz = document.getElementById('compare-viz');
    const visualizationContainer = document.getElementById('visualization-container');
    const visualizationContainer1 = document.getElementById('visualization-container-1');
    const visualizationContainer2 = document.getElementById('visualization-container-2');

    // Info elements
    const recommendationBanner = document.getElementById('recommendation-banner');
    const algorithmInfo = document.getElementById('algorithm-info');
    const variableDisplay = document.getElementById('variable-display');

    // Display Elements
    const recAlgo = document.getElementById('rec-algo');
    const recReason = document.getElementById('rec-reason');
    const confidenceValue = document.getElementById('confidence-value');
    const timeEstimate = document.getElementById('time-estimate');
    const algoTitle = document.getElementById('algo-title');
    const algoDescription = document.getElementById('algo-description');
    const bestCase = document.getElementById('best-case');
    const averageCase = document.getElementById('average-case');
    const worstCase = document.getElementById('worst-case');
    const spaceCase = document.getElementById('space-case');

    // Stats
    const comparisonsCount = document.getElementById('comparisons-count');
    const swapsCount = document.getElementById('swaps-count');
    const arraySize = document.getElementById('array-size');
    const sortednessScore = document.getElementById('sortedness-score');
    const stepExplanation = document.getElementById('step-explanation');

    // Modals
    const infoModal = document.getElementById('info-modal');
    const codeModal = document.getElementById('code-modal');
    const learnMoreBtn = document.getElementById('learn-more-btn');
    const closeModalBtn = document.getElementById('close-modal');
    const closeCodeModalBtn = document.getElementById('close-code-modal');

    // Code generation elements
    const codeBtns = document.querySelectorAll('.code-btn');
    const generatedCode = document.getElementById('generated-code');
    const codeLangTitle = document.getElementById('code-lang-title');
    const codeFilename = document.getElementById('code-filename');
    const copyCodeBtn = document.getElementById('copy-code-btn');

    // Comparison elements
    const algo1Title = document.getElementById('algo1-title');
    const algo2Title = document.getElementById('algo2-title');
    const algo1Comparisons = document.getElementById('algo1-comparisons');
    const algo1Swaps = document.getElementById('algo1-swaps');
    const algo2Comparisons = document.getElementById('algo2-comparisons');
    const algo2Swaps = document.getElementById('algo2-swaps');

    // --- STATE VARIABLES ---
    let animationSpeed = 300;
    let arrayToSort = [];
    let initialArrayState = [];
    let isSorting = false;
    let isPaused = false;
    let comparisonCount = 0;
    let swapCount = 0;
    let currentSortExecutionId = 0;
    let pausePromiseResolver = null;
    let recommendedAlgorithm = null;
    let currentMode = 'single'; // 'single' or 'compare'
    let comparisonData = {
        algo1: { comparisons: 0, swaps: 0, time: 0 },
        algo2: { comparisons: 0, swaps: 0, time: 0 }
    };

    // --- ALGORITHM DATA ---
    const ALGORITHMS = {
        bubble: {
            name: "Bubble Sort",
            description: "Simple comparison-based algorithm that repeatedly steps through the list",
            complexity: {
                best: "O(n)",
                average: "O(n²)",
                worst: "O(n²)",
                space: "O(1)"
            },
            explanation: "Bubble Sort compares adjacent elements and swaps them if they are in the wrong order. This process is repeated until the entire list is sorted. It's called bubble sort because smaller elements 'bubble' to the top."
        },
        selection: {
            name: "Selection Sort",
            description: "In-place comparison sort that divides input into sorted and unsorted regions",
            complexity: {
                best: "O(n²)",
                average: "O(n²)",
                worst: "O(n²)",
                space: "O(1)"
            },
            explanation: "Selection Sort works by finding the minimum element from the unsorted part and putting it at the beginning. It maintains two subarrays: sorted and unsorted."
        },
        insertion: {
            name: "Insertion Sort",
            description: "Efficient algorithm for small datasets, builds final sorted array one item at a time",
            complexity: {
                best: "O(n)",
                average: "O(n²)",
                worst: "O(n²)",
                space: "O(1)"
            },
            explanation: "Insertion Sort builds the sorted array one element at a time by repeatedly taking an element from the unsorted part and inserting it into the correct position in the sorted part."
        },
        merge: {
            name: "Merge Sort",
            description: "Divide-and-conquer algorithm with guaranteed O(n log n) performance",
            complexity: {
                best: "O(n log n)",
                average: "O(n log n)",
                worst: "O(n log n)",
                space: "O(n)"
            },
            explanation: "Merge Sort uses the divide-and-conquer approach. It divides the array into halves, sorts them recursively, and then merges the sorted halves back together."
        },
        quick: {
            name: "Quick Sort",
            description: "Highly efficient divide-and-conquer algorithm with excellent average-case performance",
            complexity: {
                best: "O(n log n)",
                average: "O(n log n)",
                worst: "O(n²)",
                space: "O(log n)"
            },
            explanation: "Quick Sort picks a 'pivot' element and partitions the array around it, such that elements smaller than pivot come before it and greater elements come after. It then recursively sorts the subarrays."
        },
        heap: {
            name: "Heap Sort",
            description: "Comparison-based algorithm using binary heap data structure",
            complexity: {
                best: "O(n log n)",
                average: "O(n log n)",
                worst: "O(n log n)",
                space: "O(1)"
            },
            explanation: "Heap Sort uses a binary heap data structure. It first builds a max heap from the array, then repeatedly extracts the maximum element and places it at the end of the sorted portion."
        }
    };

    const ALGO_VARS = {
        bubble: ['i', 'j'],
        selection: ['i', 'j', 'minIndex'],
        insertion: ['i', 'j', 'key'],
        merge: [],
        quick: ['low', 'high', 'pivot', 'i', 'j'],
        heap: ['i', 'j']
    };

    // --- COMPLETE CODE TEMPLATES ---
    const CODE_TEMPLATES = {
        python: {
            bubble: `def bubble_sort(arr):
    """
    Bubble Sort implementation in Python
    Time Complexity: O(n²)
    Space Complexity: O(1)
    """
    n = len(arr)

    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True

        if not swapped:
            break

    return arr

# Example usage
if __name__ == "__main__":
    data = [64, 34, 25, 12, 22, 11, 90]
    print(f"Original array: {data}")
    sorted_array = bubble_sort(data.copy())
    print(f"Sorted array: {sorted_array}")`,

            selection: `def selection_sort(arr):
    """
    Selection Sort implementation in Python
    Time Complexity: O(n²)
    Space Complexity: O(1)
    """
    n = len(arr)

    for i in range(n):
        min_index = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_index]:
                min_index = j

        arr[i], arr[min_index] = arr[min_index], arr[i]

    return arr

# Example usage
if __name__ == "__main__":
    data = [64, 34, 25, 12, 22, 11, 90]
    print(f"Original array: {data}")
    sorted_array = selection_sort(data.copy())
    print(f"Sorted array: {sorted_array}")`,

            insertion: `def insertion_sort(arr):
    """
    Insertion Sort implementation in Python
    Time Complexity: O(n²) worst/average, O(n) best
    Space Complexity: O(1)
    """
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1

        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1

        arr[j + 1] = key

    return arr

# Example usage
if __name__ == "__main__":
    data = [64, 34, 25, 12, 22, 11, 90]
    print(f"Original array: {data}")
    sorted_array = insertion_sort(data.copy())
    print(f"Sorted array: {sorted_array}")`,

            merge: `def merge_sort(arr):
    """
    Merge Sort implementation in Python
    Time Complexity: O(n log n)
    Space Complexity: O(n)
    """
    if len(arr) <= 1:
        return arr

    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])

    return merge(left, right)

def merge(left, right):
    """Merge function for Merge Sort"""
    result = []
    i = j = 0

    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1

    result.extend(left[i:])
    result.extend(right[j:])

    return result

# Example usage
if __name__ == "__main__":
    data = [64, 34, 25, 12, 22, 11, 90]
    print(f"Original array: {data}")
    sorted_array = merge_sort(data)
    print(f"Sorted array: {sorted_array}")`,

            quick: `def quick_sort(arr, low=0, high=None):
    """
    Quick Sort implementation in Python
    Time Complexity: O(n log n) average, O(n²) worst
    Space Complexity: O(log n)
    """
    if high is None:
        high = len(arr) - 1

    if low < high:
        pivot_index = partition(arr, low, high)
        quick_sort(arr, low, pivot_index - 1)
        quick_sort(arr, pivot_index + 1, high)

    return arr

def partition(arr, low, high):
    """Partition function for Quick Sort"""
    pivot = arr[high]
    i = low - 1

    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]

    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1

# Example usage
if __name__ == "__main__":
    data = [64, 34, 25, 12, 22, 11, 90]
    print(f"Original array: {data}")
    sorted_array = quick_sort(data.copy())
    print(f"Sorted array: {sorted_array}")`,

            heap: `def heap_sort(arr):
    """
    Heap Sort implementation in Python
    Time Complexity: O(n log n)
    Space Complexity: O(1)
    """
    n = len(arr)

    # Build max heap
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i)

    # Extract elements from heap
    for i in range(n - 1, 0, -1):
        arr[0], arr[i] = arr[i], arr[0]
        heapify(arr, i, 0)

    return arr

def heapify(arr, n, i):
    """Heapify function for Heap Sort"""
    largest = i
    left = 2 * i + 1
    right = 2 * i + 2

    if left < n and arr[left] > arr[largest]:
        largest = left

    if right < n and arr[right] > arr[largest]:
        largest = right

    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)

# Example usage
if __name__ == "__main__":
    data = [64, 34, 25, 12, 22, 11, 90]
    print(f"Original array: {data}")
    sorted_array = heap_sort(data.copy())
    print(f"Sorted array: {sorted_array}")`
        },

        cpp: {
            bubble: `#include <iostream>
#include <vector>
#include <algorithm>

/**
 * Bubble Sort implementation in C++
 * Time Complexity: O(n²)
 * Space Complexity: O(1)
 */
class BubbleSort {
public:
    static void sort(std::vector<int>& arr) {
        int n = arr.size();

        for (int i = 0; i < n - 1; i++) {
            bool swapped = false;

            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    std::swap(arr[j], arr[j + 1]);
                    swapped = true;
                }
            }

            if (!swapped) break;
        }
    }

    static void printArray(const std::vector<int>& arr) {
        for (size_t i = 0; i < arr.size(); i++) {
            std::cout << arr[i];
            if (i < arr.size() - 1) std::cout << " ";
        }
        std::cout << std::endl;
    }
};

int main() {
    std::vector<int> data = {64, 34, 25, 12, 22, 11, 90};

    std::cout << "Original array: ";
    BubbleSort::printArray(data);

    BubbleSort::sort(data);

    std::cout << "Sorted array: ";
    BubbleSort::printArray(data);

    return 0;
}`,

            quick: `#include <iostream>
#include <vector>
#include <algorithm>

/**
 * Quick Sort implementation in C++
 * Time Complexity: O(n log n) average, O(n²) worst
 * Space Complexity: O(log n)
 */
class QuickSort {
public:
    static void sort(std::vector<int>& arr) {
        quickSort(arr, 0, arr.size() - 1);
    }

private:
    static void quickSort(std::vector<int>& arr, int low, int high) {
        if (low < high) {
            int pivotIndex = partition(arr, low, high);
            quickSort(arr, low, pivotIndex - 1);
            quickSort(arr, pivotIndex + 1, high);
        }
    }

    static int partition(std::vector<int>& arr, int low, int high) {
        int pivot = arr[high];
        int i = low - 1;

        for (int j = low; j < high; j++) {
            if (arr[j] <= pivot) {
                i++;
                std::swap(arr[i], arr[j]);
            }
        }

        std::swap(arr[i + 1], arr[high]);
        return i + 1;
    }

public:
    static void printArray(const std::vector<int>& arr) {
        for (size_t i = 0; i < arr.size(); i++) {
            std::cout << arr[i];
            if (i < arr.size() - 1) std::cout << " ";
        }
        std::cout << std::endl;
    }
};

int main() {
    std::vector<int> data = {64, 34, 25, 12, 22, 11, 90};

    std::cout << "Original array: ";
    QuickSort::printArray(data);

    QuickSort::sort(data);

    std::cout << "Sorted array: ";
    QuickSort::printArray(data);

    return 0;
}`
        },

        java: {
            bubble: `public class BubbleSort {

    /**
     * Bubble Sort implementation in Java
     * Time Complexity: O(n²)
     * Space Complexity: O(1)
     */
    public static void bubbleSort(int[] arr) {
        int n = arr.length;

        for (int i = 0; i < n - 1; i++) {
            boolean swapped = false;

            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    // Swap elements
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    swapped = true;
                }
            }

            if (!swapped) break;
        }
    }

    public static void printArray(int[] arr) {
        for (int i = 0; i < arr.length; i++) {
            System.out.print(arr[i]);
            if (i < arr.length - 1) System.out.print(" ");
        }
        System.out.println();
    }

    public static void main(String[] args) {
        int[] data = {64, 34, 25, 12, 22, 11, 90};

        System.out.print("Original array: ");
        printArray(data);

        bubbleSort(data);

        System.out.print("Sorted array: ");
        printArray(data);
    }
}`,

            quick: `public class QuickSort {

    /**
     * Quick Sort implementation in Java
     * Time Complexity: O(n log n) average, O(n²) worst
     * Space Complexity: O(log n)
     */
    public static void quickSort(int[] arr, int low, int high) {
        if (low < high) {
            int pivotIndex = partition(arr, low, high);
            quickSort(arr, low, pivotIndex - 1);
            quickSort(arr, pivotIndex + 1, high);
        }
    }

    private static int partition(int[] arr, int low, int high) {
        int pivot = arr[high];
        int i = low - 1;

        for (int j = low; j < high; j++) {
            if (arr[j] <= pivot) {
                i++;
                int temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }

        int temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;

        return i + 1;
    }

    public static void sort(int[] arr) {
        quickSort(arr, 0, arr.length - 1);
    }

    public static void printArray(int[] arr) {
        for (int i = 0; i < arr.length; i++) {
            System.out.print(arr[i]);
            if (i < arr.length - 1) System.out.print(" ");
        }
        System.out.println();
    }

    public static void main(String[] args) {
        int[] data = {64, 34, 25, 12, 22, 11, 90};

        System.out.print("Original array: ");
        printArray(data);

        sort(data);

        System.out.print("Sorted array: ");
        printArray(data);
    }
}`
        },

        javascript: {
            bubble: `/**
 * Bubble Sort implementation in JavaScript
 * Time Complexity: O(n²)
 * Space Complexity: O(1)
 */
function bubbleSort(arr) {
    const n = arr.length;
    const sortedArray = [...arr];

    for (let i = 0; i < n - 1; i++) {
        let swapped = false;

        for (let j = 0; j < n - i - 1; j++) {
            if (sortedArray[j] > sortedArray[j + 1]) {
                [sortedArray[j], sortedArray[j + 1]] = 
                [sortedArray[j + 1], sortedArray[j]];
                swapped = true;
            }
        }

        if (!swapped) break;
    }

    return sortedArray;
}

// Example usage
const data = [64, 34, 25, 12, 22, 11, 90];
console.log('Original array:', data);

const sortedData = bubbleSort(data);
console.log('Sorted array:', sortedData);

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { bubbleSort };
}`,

            quick: `/**
 * Quick Sort implementation in JavaScript
 * Time Complexity: O(n log n) average, O(n²) worst
 * Space Complexity: O(log n)
 */
function quickSort(arr, low = 0, high = arr.length - 1) {
    if (low < high) {
        const pivotIndex = partition(arr, low, high);
        quickSort(arr, low, pivotIndex - 1);
        quickSort(arr, pivotIndex + 1, high);
    }
    return arr;
}

function partition(arr, low, high) {
    const pivot = arr[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
}

function sort(arr) {
    const sortedArray = [...arr];
    return quickSort(sortedArray);
}

// Example usage
const data = [64, 34, 25, 12, 22, 11, 90];
console.log('Original array:', data);

const sortedData = sort(data);
console.log('Sorted array:', sortedData);

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { quickSort, sort, partition };
}`
        }
    };

    // --- INITIALIZATION ---
    function init() {
        applySavedTheme();
        generateRandomArray();
        setupEventListeners();
        updateUI();
        setupModeSelector();
    }

    function setupEventListeners() {
        darkModeToggle?.addEventListener('change', handleThemeToggle);
        generateRandomBtn?.addEventListener('click', generateRandomArray);
        analyzeSortBtn?.addEventListener('click', handleAnalyzeAndSort);
        pauseResumeBtn?.addEventListener('click', handlePauseResume);
        restartBtn?.addEventListener('click', handleRestart);
        speedSlider?.addEventListener('input', handleSpeedChange);
        listInput?.addEventListener('input', handleInputChange);

        modeBtns.forEach(btn => {
            btn.addEventListener('click', handleModeChange);
        });

        genBtns.forEach(btn => {
            btn.addEventListener('click', handleDataGeneration);
        });

        // FIXED: Code generation event listeners
        codeBtns.forEach(btn => {
            btn.addEventListener('click', handleCodeGeneration);
        });

        learnMoreBtn?.addEventListener('click', showAlgorithmDetails);
        closeModalBtn?.addEventListener('click', () => hideModal(infoModal));
        closeCodeModalBtn?.addEventListener('click', () => hideModal(codeModal));
        copyCodeBtn?.addEventListener('click', copyCodeToClipboard);

        [infoModal, codeModal].forEach(modal => {
            modal?.addEventListener('click', (e) => {
                if (e.target === modal) {
                    hideModal(modal);
                }
            });
        });

        algorithm1Select?.addEventListener('change', updateComparisonTitles);
        algorithm2Select?.addEventListener('change', updateComparisonTitles);
    }

    // --- MODE MANAGEMENT - FIXED ---
    function setupModeSelector() {
        updateModeDisplay();
    }

    function handleModeChange(e) {
        const newMode = e.target.dataset.mode || e.target.closest('.mode-btn').dataset.mode;
        if (newMode === currentMode) return;

        modeBtns.forEach(btn => btn.classList.remove('active'));
        e.target.closest('.mode-btn').classList.add('active');

        currentMode = newMode;
        updateModeDisplay();

        // Reset and update display for new mode
        if (arrayToSort.length > 0) {
            updateArrayDisplay();
        }
    }

    function updateModeDisplay() {
        if (currentMode === 'single') {
            comparisonSelectors?.classList.add('hidden');
            singleViz?.classList.remove('hidden');
            compareViz?.classList.add('hidden');
        } else {
            comparisonSelectors?.classList.remove('hidden');
            singleViz?.classList.add('hidden');
            compareViz?.classList.remove('hidden');
            updateComparisonTitles();
        }
    }

    function updateComparisonTitles() {
        if (algorithm1Select && algorithm2Select && algo1Title && algo2Title) {
            const algo1 = algorithm1Select.value;
            const algo2 = algorithm2Select.value;
            algo1Title.textContent = ALGORITHMS[algo1].name;
            algo2Title.textContent = ALGORITHMS[algo2].name;
        }
    }

    // --- DATA GENERATION ---
    function handleDataGeneration(e) {
        const type = e.target.closest('.gen-btn').dataset.type;
        let array = [];

        switch (type) {
            case 'nearly-sorted':
                array = generateNearlySortedArray();
                break;
            case 'reverse':
                array = generateReverseSortedArray();
                break;
            case 'few-unique':
                array = generateFewUniqueArray();
                break;
            case 'all-equal':
                array = generateAllEqualArray();
                break;
        }

        listInput.value = array.join(', ');
        processNewArray(array);
    }

    function generateNearlySortedArray() {
        const size = 25;
        const array = Array.from({ length: size }, (_, i) => i * 4 + 1);
        for (let i = 0; i < 3; i++) {
            const idx1 = Math.floor(Math.random() * size);
            const idx2 = Math.floor(Math.random() * size);
            [array[idx1], array[idx2]] = [array[idx2], array[idx1]];
        }
        return array;
    }

    function generateReverseSortedArray() {
        const size = 20;
        return Array.from({ length: size }, (_, i) => (size - i) * 4);
    }

    function generateFewUniqueArray() {
        const size = 30;
        const uniqueValues = [10, 25, 50, 75, 90];
        return Array.from({ length: size }, () => 
            uniqueValues[Math.floor(Math.random() * uniqueValues.length)]
        );
    }

    function generateAllEqualArray() {
        const size = 15;
        const value = 42;
        return Array.from({ length: size }, () => value);
    }

    // --- THEME HANDLING ---
    function applySavedTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.setAttribute('data-theme', 'dark');
            if (darkModeToggle) darkModeToggle.checked = true;
        }
    }

    function handleThemeToggle() {
        if (darkModeToggle?.checked) {
            document.body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        }
    }

    // --- ARRAY GENERATION & INPUT ---
    function generateRandomArray() {
        const sizes = [8, 12, 15, 18, 22, 25];
        const size = sizes[Math.floor(Math.random() * sizes.length)];
        const array = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
        listInput.value = array.join(', ');
        processNewArray(array);
    }

    function handleInputChange() {
        const input = listInput?.value.trim();
        if (!input) return;

        const array = parseInput(input);
        if (array.length > 1) {
            processNewArray(array);
        }
    }

    function parseInput(input) {
        return input.split(',')
            .map(item => parseInt(item.trim(), 10))
            .filter(num => !isNaN(num) && isFinite(num));
    }

    function processNewArray(array) {
        if (isSorting) handleRestart();
        arrayToSort = [...array];
        initialArrayState = [...array];
        updateArrayDisplay();
        if (currentMode === 'single') {
            analyzeArray(array);
        }
        updateUI();
    }

    // --- IMPROVED INTELLIGENT ANALYSIS ENGINE ---
    function analyzeArray(array) {
        const analysis = {
            size: array.length,
            sortedness: calculateSortedness(array),
            inversions: countInversions(array),
            range: Math.max(...array) - Math.min(...array),
            duplicates: array.length - new Set(array).size,
            isReverseSorted: isReverseSorted(array),
            hasLowVariance: hasLowVariance(array)
        };

        recommendedAlgorithm = selectOptimalAlgorithm(analysis, array);
        displayRecommendation(recommendedAlgorithm, analysis);
        updateStats(analysis);
    }

    function calculateSortedness(array) {
        if (array.length <= 1) return 1.0;
        let sortedPairs = 0;
        for (let i = 0; i < array.length - 1; i++) {
            if (array[i] <= array[i + 1]) {
                sortedPairs++;
            }
        }
        return sortedPairs / (array.length - 1);
    }

    function countInversions(array) {
        let inversions = 0;
        for (let i = 0; i < array.length - 1; i++) {
            for (let j = i + 1; j < array.length; j++) {
                if (array[i] > array[j]) {
                    inversions++;
                }
            }
        }
        return inversions;
    }

    function isReverseSorted(array) {
        for (let i = 0; i < array.length - 1; i++) {
            if (array[i] < array[i + 1]) {
                return false;
            }
        }
        return true;
    }

    function hasLowVariance(array) {
        const uniqueValues = new Set(array).size;
        return uniqueValues <= Math.max(3, array.length / 5);
    }

    // --- MUCH IMPROVED ALGORITHM SELECTION LOGIC ---
    function selectOptimalAlgorithm(analysis, array) {
        const { size, sortedness, inversions, duplicates, isReverseSorted, hasLowVariance } = analysis;
        const maxInversions = (size * (size - 1)) / 2;
        const inversionRatio = inversions / maxInversions;
        
        console.log('Array Analysis:', analysis); // Debug info
        
        // Small random arrays - Bubble Sort for educational purposes
        if (size <= 12 && sortedness < 0.3) {
            return {
                algorithm: 'bubble',
                confidence: 0.75,
                reason: 'Educational choice for small random datasets',
                estimatedTime: Math.ceil(size * size / 8)
            };
        }
        // Small arrays with high duplication - Selection Sort  
        if (size <= 15 && duplicates > size * 0.4) {
            return {
                algorithm: 'selection',
                confidence: 0.88,
                reason: 'Efficient for small arrays with many duplicate values',
                estimatedTime: Math.ceil(size * size / 12)
            };
        }
        // Very small arrays - Insertion Sort
        if (size <= 8) {
            return {
                algorithm: 'insertion',
                confidence: 0.95,
                reason: 'Optimal for very small arrays due to minimal overhead',
                estimatedTime: Math.ceil(size * size / 15)
            };
        }
        
        
        // Low variance/few unique values - Quick Sort can struggle
        if (hasLowVariance && size > 20) {
            return {
                algorithm: 'merge',
                confidence: 0.89,
                reason: 'Guaranteed O(n log n) performance for arrays with few unique values',
                estimatedTime: Math.ceil(size * Math.log2(size) * 1.8)
            };
        }
        // Nearly sorted arrays - Insertion Sort
        if (sortedness > 0.8) {
            return {
                algorithm: 'insertion',
                confidence: 0.92,
                reason: 'Excellent for nearly sorted data (O(n) best case performance)',
                estimatedTime: Math.ceil(size * 1.5)
            };
        }

        // Reverse sorted arrays - Selection Sort for educational value
        if (isReverseSorted) {
            return {
                algorithm: 'selection',
                confidence: 0.85,
                reason: 'Consistent O(n²) performance, good for reverse-sorted arrays',
                estimatedTime: Math.ceil(size * size / 10)
            };
        }



        // Medium sized arrays - Quick Sort
        if (size <= 40 && !hasLowVariance) {
            return {
                algorithm: 'quick',
                confidence: 0.87,
                reason: 'Excellent average-case performance for medium-sized random arrays',
                estimatedTime: Math.ceil(size * Math.log2(size) * 1.4)
            };
        }

        // Larger arrays - Merge Sort for consistency
        if (size <= 80) {
            return {
                algorithm: 'merge',
                confidence: 0.93,
                reason: 'Guaranteed O(n log n) performance and stable sorting',
                estimatedTime: Math.ceil(size * Math.log2(size) * 1.7)
            };
        }

        // Very large arrays - Heap Sort for space efficiency
        return {
            algorithm: 'heap',
            confidence: 0.90,
            reason: 'Optimal space complexity O(1) for very large arrays',
            estimatedTime: Math.ceil(size * Math.log2(size) * 2.2)
        };
    }

    function displayRecommendation(recommendation, analysis) {
        const algoData = ALGORITHMS[recommendation.algorithm];
        if (recAlgo) recAlgo.textContent = algoData.name;
        if (recReason) recReason.textContent = recommendation.reason;
        if (confidenceValue) confidenceValue.textContent = Math.round(recommendation.confidence * 100) + '%';
        if (timeEstimate) timeEstimate.textContent = `~${recommendation.estimatedTime}ms`;

        if (algoTitle) algoTitle.textContent = algoData.name;
        if (algoDescription) algoDescription.textContent = algoData.description;
        if (bestCase) bestCase.textContent = algoData.complexity.best;
        if (averageCase) averageCase.textContent = algoData.complexity.average;
        if (worstCase) worstCase.textContent = algoData.complexity.worst;
        if (spaceCase) spaceCase.textContent = algoData.complexity.space;

        recommendationBanner?.classList.remove('hidden');
        algorithmInfo?.classList.remove('hidden');
    }

    function updateStats(analysis) {
        if (arraySize) arraySize.textContent = analysis.size;
        if (sortednessScore) sortednessScore.textContent = Math.round(analysis.sortedness * 100) + '%';
    }

    // --- SORTING CONTROL ---
    async function handleAnalyzeAndSort() {
        if (isSorting) return;

        const input = listInput?.value.trim();
        if (!input) {
            showMessage('Please enter some numbers first!', 'warning');
            return;
        }

        const array = parseInput(input);
        if (array.length <= 1) {
            showMessage('Please enter at least 2 numbers to sort.', 'warning');
            return;
        }

        processNewArray(array);
        await sleep(500);

        if (currentMode === 'single') {
            startSorting();
        } else {
            startComparisonSorting();
        }
    }

    // --- FIXED COMPARISON SORTING ---
    async function startComparisonSorting() {
        const algo1 = algorithm1Select?.value || 'bubble';
        const algo2 = algorithm2Select?.value || 'selection';

        if (algo1 === algo2) {
            showMessage('Please select different algorithms for comparison.', 'warning');
            return;
        }

        disableControls();
        resetComparisonCounters();
        const executionId = ++currentSortExecutionId;

        const container1 = visualizationContainer1;
        const container2 = visualizationContainer2;

        updateExplanation(`Comparing ${ALGORITHMS[algo1].name} vs ${ALGORITHMS[algo2].name}...`);

        try {
            const array1 = [...arrayToSort];
            const array2 = [...arrayToSort];

            // Create bars for both containers
            createBarsForComparison();

            const bars1 = container1?.querySelectorAll('.bar') || [];
            const bars2 = container2?.querySelectorAll('.bar') || [];

            // Run both algorithms simultaneously
            await Promise.all([
                executeSortingAlgorithm(algo1, array1, bars1, executionId, 'algo1'),
                executeSortingAlgorithm(algo2, array2, bars2, executionId, 'algo2')
            ]);

            if (executionId === currentSortExecutionId) {
                await finalizeComparisonSorting(bars1, bars2, executionId);
            }
        } catch (error) {
            if (error.message !== "Sort Canceled") {
                console.error("Comparison sorting error:", error);
            }
        } finally {
            if (executionId === currentSortExecutionId) {
                enableControls(true);
            }
        }
    }

    async function startSorting() {
        if (!recommendedAlgorithm) return;

        disableControls();
        resetCounters();
        const executionId = ++currentSortExecutionId;
        const algorithm = recommendedAlgorithm.algorithm;

        updateExplanation(`Starting ${ALGORITHMS[algorithm].name}...`);
        setupVariableDisplay(algorithm);

        try {
            const arrayCopy = [...arrayToSort];
            await executeSortingAlgorithm(algorithm, arrayCopy, null, executionId);

            if (executionId === currentSortExecutionId) {
                arrayToSort = arrayCopy;
                await finalizeSorting(executionId);
            }
        } catch (error) {
            if (error.message !== "Sort Canceled") {
                console.error("Sorting error:", error);
            }
        } finally {
            if (executionId === currentSortExecutionId) {
                enableControls(true);
            }
        }
    }

    async function executeSortingAlgorithm(algorithm, array, bars, executionId, comparisonId = null) {
        // If bars is null, get them from the single visualization container
        if (!bars) {
            bars = document.querySelectorAll('#visualization-container .bar');
        }

        switch (algorithm) {
            case 'bubble':
                await bubbleSort(array, bars, executionId, comparisonId);
                break;
            case 'selection':
                await selectionSort(array, bars, executionId, comparisonId);
                break;
            case 'insertion':
                await insertionSort(array, bars, executionId, comparisonId);
                break;
            case 'merge':
                await mergeSort(array, bars, executionId, comparisonId);
                break;
            case 'quick':
                await quickSort(array, 0, array.length - 1, bars, executionId, comparisonId);
                break;
            case 'heap':
                await heapSort(array, bars, executionId, comparisonId);
                break;
            default:
                throw new Error(`Unknown algorithm: ${algorithm}`);
        }
    }

    function resetComparisonCounters() {
        comparisonData = {
            algo1: { comparisons: 0, swaps: 0, time: Date.now() },
            algo2: { comparisons: 0, swaps: 0, time: Date.now() }
        };
        updateComparisonStats();
    }

    function updateComparisonStats() {
        if (algo1Comparisons) algo1Comparisons.textContent = comparisonData.algo1.comparisons;
        if (algo1Swaps) algo1Swaps.textContent = comparisonData.algo1.swaps;
        if (algo2Comparisons) algo2Comparisons.textContent = comparisonData.algo2.comparisons;
        if (algo2Swaps) algo2Swaps.textContent = comparisonData.algo2.swaps;
    }

    async function finalizeComparisonSorting(bars1, bars2, executionId) {
        const animateBars = async (bars) => {
            for (let i = 0; i < bars.length; i++) {
                if (executionId !== currentSortExecutionId) return;
                await sleep(30, executionId);
                bars[i].style.backgroundColor = 'var(--bar-sorted)';
            }
        };

        await Promise.all([animateBars(bars1), animateBars(bars2)]);

        updateExplanation(
            `✅ Comparison complete! 
            ${ALGORITHMS[algorithm1Select?.value || 'bubble'].name}: ${comparisonData.algo1.comparisons} comparisons, ${comparisonData.algo1.swaps} swaps | 
            ${ALGORITHMS[algorithm2Select?.value || 'selection'].name}: ${comparisonData.algo2.comparisons} comparisons, ${comparisonData.algo2.swaps} swaps`
        );
    }

    async function finalizeSorting(executionId) {
        const bars = document.querySelectorAll('#visualization-container .bar');
        for (let i = 0; i < bars.length; i++) {
            if (executionId !== currentSortExecutionId) return;
            await sleep(50, executionId);
            bars[i].style.backgroundColor = 'var(--bar-sorted)';
        }
        updateExplanation(
            `✅ Sorting complete! Made ${comparisonCount} comparisons and ${swapCount} array writes.`
        );
        clearVariables();
    }

    // --- ALGORITHM IMPLEMENTATIONS ---
    async function bubbleSort(array, bars, executionId, comparisonId = null) {
        const n = array.length;

        for (let i = 0; i < n - 1; i++) {
            if (executionId !== currentSortExecutionId) throw new Error("Sort Canceled");

            let swapped = false;
            for (let j = 0; j < n - i - 1; j++) {
                if (executionId !== currentSortExecutionId) throw new Error("Sort Canceled");

                await checkPause(executionId);

                if (bars && bars[j] && bars[j + 1]) {
                    bars[j].style.backgroundColor = 'var(--bar-compare)';
                    bars[j + 1].style.backgroundColor = 'var(--bar-compare)';
                }

                updateVariables({ i, j }, comparisonId);
                incrementComparisons(comparisonId);
                updateExplanation(`Comparing elements at positions ${j} and ${j + 1}: ${array[j]} vs ${array[j + 1]}`);

                await sleep(animationSpeed, executionId);

                if (array[j] > array[j + 1]) {
                    if (bars && bars[j] && bars[j + 1]) {
                        bars[j].style.backgroundColor = 'var(--bar-swap)';
                        bars[j + 1].style.backgroundColor = 'var(--bar-swap)';
                    }

                    [array[j], array[j + 1]] = [array[j + 1], array[j]];

                    if (bars && bars[j] && bars[j + 1]) {
                        const temp = bars[j].style.height;
                        bars[j].style.height = bars[j + 1].style.height;
                        bars[j + 1].style.height = temp;

                        const tempLabel = bars[j].querySelector('.bar-label')?.textContent;
                        const label1 = bars[j].querySelector('.bar-label');
                        const label2 = bars[j + 1].querySelector('.bar-label');
                        if (label1 && label2) {
                            label1.textContent = label2.textContent;
                            label2.textContent = tempLabel;
                        }
                    }

                    incrementSwaps(comparisonId);
                    swapped = true;

                    await sleep(animationSpeed, executionId);
                }

                if (bars && bars[j] && bars[j + 1]) {
                    bars[j].style.backgroundColor = 'var(--bar-default)';
                    bars[j + 1].style.backgroundColor = 'var(--bar-default)';
                }
            }

            if (bars && bars[n - 1 - i]) {
                bars[n - 1 - i].style.backgroundColor = 'var(--bar-sorted)';
            }

            if (!swapped) break;
        }

        if (bars && bars[0]) {
            bars[0].style.backgroundColor = 'var(--bar-sorted)';
        }
    }

    async function quickSort(array, low, high, bars, executionId, comparisonId = null) {
        if (low < high) {
            if (executionId !== currentSortExecutionId) throw new Error("Sort Canceled");

            updateVariables({ low, high }, comparisonId);
            const pivotIndex = await partition(array, low, high, bars, executionId, comparisonId);

            await quickSort(array, low, pivotIndex - 1, bars, executionId, comparisonId);
            await quickSort(array, pivotIndex + 1, high, bars, executionId, comparisonId);
        }
    }

    async function partition(array, low, high, bars, executionId, comparisonId = null) {
        const pivot = array[high];
        let i = low - 1;

        if (bars && bars[high]) {
            bars[high].style.backgroundColor = 'var(--bar-pivot)';
        }
        updateVariables({ low, high, pivot, i }, comparisonId);
        updateExplanation(`Partitioning with pivot ${pivot} at position ${high}`);

        await sleep(animationSpeed, executionId);

        for (let j = low; j < high; j++) {
            if (executionId !== currentSortExecutionId) throw new Error("Sort Canceled");
            await checkPause(executionId);

            if (bars && bars[j]) {
                bars[j].style.backgroundColor = 'var(--bar-compare)';
            }
            updateVariables({ low, high, pivot, i, j }, comparisonId);
            incrementComparisons(comparisonId);

            updateExplanation(`Comparing ${array[j]} with pivot ${pivot}`);
            await sleep(animationSpeed, executionId);

            if (array[j] <= pivot) {
                i++;

                if (i !== j) {
                    if (bars && bars[i] && bars[j]) {
                        bars[i].style.backgroundColor = 'var(--bar-swap)';
                        bars[j].style.backgroundColor = 'var(--bar-swap)';
                    }

                    [array[i], array[j]] = [array[j], array[i]];

                    if (bars && bars[i] && bars[j]) {
                        const tempHeight = bars[i].style.height;
                        bars[i].style.height = bars[j].style.height;
                        bars[j].style.height = tempHeight;

                        const label1 = bars[i].querySelector('.bar-label');
                        const label2 = bars[j].querySelector('.bar-label');
                        if (label1 && label2) {
                            const tempLabel = label1.textContent;
                            label1.textContent = label2.textContent;
                            label2.textContent = tempLabel;
                        }
                    }

                    incrementSwaps(comparisonId);
                    await sleep(animationSpeed, executionId);
                }
            }

            if (bars && bars[j]) {
                bars[j].style.backgroundColor = 'var(--bar-default)';
            }
            if (bars && bars[i] && i >= 0) {
                bars[i].style.backgroundColor = 'var(--bar-default)';
            }
        }

        // Final swap with pivot
        i++;
        if (bars && bars[i] && bars[high]) {
            bars[i].style.backgroundColor = 'var(--bar-swap)';
            bars[high].style.backgroundColor = 'var(--bar-swap)';
        }

        [array[i], array[high]] = [array[high], array[i]];

        if (bars && bars[i] && bars[high]) {
            const tempHeight = bars[i].style.height;
            bars[i].style.height = bars[high].style.height;
            bars[high].style.height = tempHeight;

            const label1 = bars[i].querySelector('.bar-label');
            const label2 = bars[high].querySelector('.bar-label');
            if (label1 && label2) {
                const tempLabel = label1.textContent;
                label1.textContent = label2.textContent;
                label2.textContent = tempLabel;
            }
        }

        incrementSwaps(comparisonId);
        await sleep(animationSpeed, executionId);

        if (bars && bars[i]) {
            bars[i].style.backgroundColor = 'var(--bar-sorted)';
        }
        if (bars && bars[high]) {
            bars[high].style.backgroundColor = 'var(--bar-default)';
        }

        return i;
    }

    async function selectionSort(array, bars, executionId, comparisonId = null) {
        const n = array.length;

        for (let i = 0; i < n - 1; i++) {
            if (executionId !== currentSortExecutionId) throw new Error("Sort Canceled");

            let minIndex = i;
            if (bars && bars[i]) {
                bars[i].style.backgroundColor = 'var(--bar-compare)';
            }

            updateVariables({ i, minIndex }, comparisonId);
            updateExplanation(`Finding minimum element from position ${i} onwards`);

            for (let j = i + 1; j < n; j++) {
                if (executionId !== currentSortExecutionId) throw new Error("Sort Canceled");
                await checkPause(executionId);

                if (bars && bars[j]) {
                    bars[j].style.backgroundColor = 'var(--bar-compare)';
                }
                updateVariables({ i, j, minIndex }, comparisonId);
                incrementComparisons(comparisonId);

                updateExplanation(`Comparing ${array[j]} with current minimum ${array[minIndex]}`);
                await sleep(animationSpeed, executionId);

                if (array[j] < array[minIndex]) {
                    if (bars && bars[minIndex] && minIndex !== i) {
                        bars[minIndex].style.backgroundColor = 'var(--bar-default)';
                    }
                    minIndex = j;
                    if (bars && bars[minIndex]) {
                        bars[minIndex].style.backgroundColor = 'var(--bar-highlight)';
                    }
                } else {
                    if (bars && bars[j]) {
                        bars[j].style.backgroundColor = 'var(--bar-default)';
                    }
                }
            }

            if (minIndex !== i) {
                if (bars && bars[i] && bars[minIndex]) {
                    bars[i].style.backgroundColor = 'var(--bar-swap)';
                    bars[minIndex].style.backgroundColor = 'var(--bar-swap)';
                }

                [array[i], array[minIndex]] = [array[minIndex], array[i]];

                if (bars && bars[i] && bars[minIndex]) {
                    const tempHeight = bars[i].style.height;
                    bars[i].style.height = bars[minIndex].style.height;
                    bars[minIndex].style.height = tempHeight;

                    const label1 = bars[i].querySelector('.bar-label');
                    const label2 = bars[minIndex].querySelector('.bar-label');
                    if (label1 && label2) {
                        const tempLabel = label1.textContent;
                        label1.textContent = label2.textContent;
                        label2.textContent = tempLabel;
                    }
                }

                incrementSwaps(comparisonId);
                await sleep(animationSpeed, executionId);
            }

            if (bars && bars[i]) {
                bars[i].style.backgroundColor = 'var(--bar-sorted)';
            }
            if (bars && bars[minIndex] && minIndex !== i) {
                bars[minIndex].style.backgroundColor = 'var(--bar-default)';
            }
        }

        if (bars && bars[n - 1]) {
            bars[n - 1].style.backgroundColor = 'var(--bar-sorted)';
        }
    }

    async function insertionSort(array, bars, executionId, comparisonId = null) {
        const n = array.length;
        if (bars && bars[0]) {
            bars[0].style.backgroundColor = 'var(--bar-sorted)';
        }

        for (let i = 1; i < n; i++) {
            if (executionId !== currentSortExecutionId) throw new Error("Sort Canceled");

            const key = array[i];
            let j = i - 1;

            if (bars && bars[i]) {
                bars[i].style.backgroundColor = 'var(--bar-highlight)';
            }
            updateVariables({ i, j, key }, comparisonId);
            updateExplanation(`Inserting ${key} into the sorted portion`);

            await sleep(animationSpeed, executionId);

            while (j >= 0 && array[j] > key) {
                if (executionId !== currentSortExecutionId) throw new Error("Sort Canceled");
                await checkPause(executionId);

                if (bars && bars[j] && bars[j + 1]) {
                    bars[j].style.backgroundColor = 'var(--bar-compare)';
                    bars[j + 1].style.backgroundColor = 'var(--bar-swap)';
                }

                incrementComparisons(comparisonId);
                updateVariables({ i, j, key }, comparisonId);
                updateExplanation(`Moving ${array[j]} one position right`);

                array[j + 1] = array[j];

                if (bars && bars[j] && bars[j + 1]) {
                    bars[j + 1].style.height = bars[j].style.height;
                    const label1 = bars[j].querySelector('.bar-label');
                    const label2 = bars[j + 1].querySelector('.bar-label');
                    if (label1 && label2) {
                        label2.textContent = label1.textContent;
                    }
                }

                incrementSwaps(comparisonId);
                await sleep(animationSpeed, executionId);

                if (bars && bars[j] && bars[j + 1]) {
                    bars[j].style.backgroundColor = 'var(--bar-default)';
                    bars[j + 1].style.backgroundColor = 'var(--bar-default)';
                }

                j--;
            }

            if (j >= 0) {
                incrementComparisons(comparisonId);
            }

            array[j + 1] = key;

            if (bars && bars[j + 1]) {
                bars[j + 1].style.height = `${(key / Math.max(...initialArrayState)) * 300}px`;
                const label = bars[j + 1].querySelector('.bar-label');
                if (label) {
                    label.textContent = key;
                }
                bars[j + 1].style.backgroundColor = 'var(--bar-sorted)';
            }

            updateExplanation(`Placed ${key} at position ${j + 1}`);
            await sleep(animationSpeed, executionId);
        }
    }

    async function mergeSort(array, bars, executionId, comparisonId = null) {
        async function merge(left, right, start, mid, end) {
            const result = [];
            let i = 0, j = 0;
            let k = start;

            while (i < left.length && j < right.length) {
                if (executionId !== currentSortExecutionId) throw new Error("Sort Canceled");
                await checkPause(executionId);

                if (bars && bars[k]) {
                    bars[k].style.backgroundColor = 'var(--bar-compare)';
                }
                incrementComparisons(comparisonId);

                if (left[i] <= right[j]) {
                    result.push(left[i]);
                    array[k] = left[i];
                    i++;
                } else {
                    result.push(right[j]);
                    array[k] = right[j];
                    j++;
                }

                if (bars && bars[k]) {
                    bars[k].style.height = `${(array[k] / Math.max(...initialArrayState)) * 300}px`;
                    const label = bars[k].querySelector('.bar-label');
                    if (label) {
                        label.textContent = array[k];
                    }
                    bars[k].style.backgroundColor = 'var(--bar-sorted)';
                }

                incrementSwaps(comparisonId);
                await sleep(animationSpeed, executionId);
                k++;
            }

            while (i < left.length) {
                result.push(left[i]);
                array[k] = left[i];
                if (bars && bars[k]) {
                    bars[k].style.height = `${(array[k] / Math.max(...initialArrayState)) * 300}px`;
                    const label = bars[k].querySelector('.bar-label');
                    if (label) {
                        label.textContent = array[k];
                    }
                    bars[k].style.backgroundColor = 'var(--bar-sorted)';
                }
                i++;
                k++;
            }

            while (j < right.length) {
                result.push(right[j]);
                array[k] = right[j];
                if (bars && bars[k]) {
                    bars[k].style.height = `${(array[k] / Math.max(...initialArrayState)) * 300}px`;
                    const label = bars[k].querySelector('.bar-label');
                    if (label) {
                        label.textContent = array[k];
                    }
                    bars[k].style.backgroundColor = 'var(--bar-sorted)';
                }
                j++;
                k++;
            }

            return result;
        }

        async function mergeSortRecursive(arr, start, end) {
            if (start >= end) return [arr[start]];

            const mid = Math.floor((start + end) / 2);
            updateExplanation(`Dividing array from ${start} to ${end} at position ${mid}`);

            const left = await mergeSortRecursive(arr, start, mid);
            const right = await mergeSortRecursive(arr, mid + 1, end);

            updateExplanation(`Merging subarrays from ${start} to ${mid} and ${mid + 1} to ${end}`);
            return await merge(left, right, start, mid, end);
        }

        await mergeSortRecursive(array, 0, array.length - 1);
    }

    async function heapSort(array, bars, executionId, comparisonId = null) {
        const n = array.length;

        // Build max heap
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            await heapify(array, n, i, bars, executionId, comparisonId);
        }

        // Extract elements from heap
        for (let i = n - 1; i > 0; i--) {
            if (executionId !== currentSortExecutionId) throw new Error("Sort Canceled");

            if (bars && bars[0] && bars[i]) {
                bars[0].style.backgroundColor = 'var(--bar-swap)';
                bars[i].style.backgroundColor = 'var(--bar-swap)';
            }

            [array[0], array[i]] = [array[i], array[0]];

            if (bars && bars[0] && bars[i]) {
                const tempHeight = bars[0].style.height;
                bars[0].style.height = bars[i].style.height;
                bars[i].style.height = tempHeight;

                const label1 = bars[0].querySelector('.bar-label');
                const label2 = bars[i].querySelector('.bar-label');
                if (label1 && label2) {
                    const tempLabel = label1.textContent;
                    label1.textContent = label2.textContent;
                    label2.textContent = tempLabel;
                }
            }

            incrementSwaps(comparisonId);
            await sleep(animationSpeed, executionId);

            if (bars && bars[i]) {
                bars[i].style.backgroundColor = 'var(--bar-sorted)';
            }
            if (bars && bars[0]) {
                bars[0].style.backgroundColor = 'var(--bar-default)';
            }

            await heapify(array, i, 0, bars, executionId, comparisonId);
        }

        if (bars && bars[0]) {
            bars[0].style.backgroundColor = 'var(--bar-sorted)';
        }
    }

    async function heapify(array, n, i, bars, executionId, comparisonId = null) {
        let largest = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;

        if (left < n) {
            if (bars && bars[left]) {
                bars[left].style.backgroundColor = 'var(--bar-compare)';
            }
            incrementComparisons(comparisonId);
            updateVariables({ i, j: left }, comparisonId);
            await sleep(animationSpeed / 2, executionId);

            if (array[left] > array[largest]) {
                largest = left;
            }
            if (bars && bars[left]) {
                bars[left].style.backgroundColor = 'var(--bar-default)';
            }
        }

        if (right < n) {
            if (bars && bars[right]) {
                bars[right].style.backgroundColor = 'var(--bar-compare)';
            }
            incrementComparisons(comparisonId);
            updateVariables({ i, j: right }, comparisonId);
            await sleep(animationSpeed / 2, executionId);

            if (array[right] > array[largest]) {
                largest = right;
            }
            if (bars && bars[right]) {
                bars[right].style.backgroundColor = 'var(--bar-default)';
            }
        }

        if (largest !== i) {
            if (bars && bars[i] && bars[largest]) {
                bars[i].style.backgroundColor = 'var(--bar-swap)';
                bars[largest].style.backgroundColor = 'var(--bar-swap)';
            }

            [array[i], array[largest]] = [array[largest], array[i]];

            if (bars && bars[i] && bars[largest]) {
                const tempHeight = bars[i].style.height;
                bars[i].style.height = bars[largest].style.height;
                bars[largest].style.height = tempHeight;

                const label1 = bars[i].querySelector('.bar-label');
                const label2 = bars[largest].querySelector('.bar-label');
                if (label1 && label2) {
                    const tempLabel = label1.textContent;
                    label1.textContent = label2.textContent;
                    label2.textContent = tempLabel;
                }
            }

            incrementSwaps(comparisonId);
            await sleep(animationSpeed, executionId);

            if (bars && bars[i] && bars[largest]) {
                bars[i].style.backgroundColor = 'var(--bar-default)';
                bars[largest].style.backgroundColor = 'var(--bar-default)';
            }

            await heapify(array, n, largest, bars, executionId, comparisonId);
        }
    }

    // --- UTILITY FUNCTIONS ---
    function incrementComparisons(comparisonId = null) {
        if (comparisonId) {
            comparisonData[comparisonId].comparisons++;
            updateComparisonStats();
        } else {
            comparisonCount++;
            if (comparisonsCount) comparisonsCount.textContent = comparisonCount;
        }
    }

    function incrementSwaps(comparisonId = null) {
        if (comparisonId) {
            comparisonData[comparisonId].swaps++;
            updateComparisonStats();
        } else {
            swapCount++;
            if (swapsCount) swapsCount.textContent = swapCount;
        }
    }

    function updateVariables(vars, comparisonId = null) {
        Object.entries(vars).forEach(([key, value]) => {
            const element = document.getElementById(`var-${key}-value`);
            if (element) {
                element.textContent = value !== undefined ? value : '-';
            }
        });
    }

    function setupVariableDisplay(algorithm) {
        const relevantVars = ALGO_VARS[algorithm] || [];

        document.querySelectorAll('.variable-box').forEach(box => {
            const varName = box.querySelector('strong')?.textContent.replace(':', '');
            if (relevantVars.includes(varName)) {
                box.classList.remove('hidden');
            } else {
                box.classList.add('hidden');
            }
        });
    }

    function clearVariables() {
        document.querySelectorAll('[id*="var-"][id*="-value"]').forEach(element => {
            element.textContent = '-';
        });
    }

    function updateExplanation(text) {
        if (stepExplanation) stepExplanation.textContent = text;
    }

    async function sleep(ms, executionId) {
        return new Promise(resolve => {
            setTimeout(() => {
                if (executionId && executionId !== currentSortExecutionId) {
                    throw new Error("Sort Canceled");
                }
                resolve();
            }, ms);
        });
    }

    async function checkPause(executionId) {
        while (isPaused && executionId === currentSortExecutionId) {
            await new Promise(resolve => {
                pausePromiseResolver = resolve;
            });
        }
    }

    function resetCounters() {
        comparisonCount = 0;
        swapCount = 0;
        if (comparisonsCount) comparisonsCount.textContent = '0';
        if (swapsCount) swapsCount.textContent = '0';
    }

    // --- ARRAY DISPLAY - FIXED ---
    function updateArrayDisplay() {
        if (currentMode === 'single') {
            updateSingleArrayDisplay();
        } else {
            createBarsForComparison();
        }
    }

    function updateSingleArrayDisplay() {
        const container = visualizationContainer;
        if (!container) return;

        container.innerHTML = '';

        if (arrayToSort.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-chart-bar"></i>
                    <h4>Enter data above to see the magic happen!</h4>
                    <p>Choose your numbers and watch algorithms come to life</p>
                </div>
            `;
            return;
        }

        const maxValue = Math.max(...arrayToSort);
        const containerWidth = container.clientWidth - 80;
        const barWidth = Math.max((containerWidth / arrayToSort.length) - 4, 8);

        arrayToSort.forEach((value, index) => {
            const bar = document.createElement('div');
            bar.className = 'bar';
            bar.style.height = `${(value / maxValue) * 300}px`;
            bar.style.width = `${barWidth}px`;
            bar.dataset.index = index;
            bar.dataset.value = value;

            const label = document.createElement('div');
            label.className = 'bar-label';
            label.textContent = value;
            bar.appendChild(label);

            container.appendChild(bar);
        });
    }

    function createBarsForComparison() {
        if (!visualizationContainer1 || !visualizationContainer2) return;

        visualizationContainer1.innerHTML = '';
        visualizationContainer2.innerHTML = '';

        if (arrayToSort.length === 0) {
            [visualizationContainer1, visualizationContainer2].forEach(container => {
                container.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-chart-bar"></i>
                        <h5>Enter data to compare algorithms</h5>
                    </div>
                `;
            });
            return;
        }

        const maxValue = Math.max(...arrayToSort);

        [visualizationContainer1, visualizationContainer2].forEach(container => {
            const containerWidth = container.clientWidth - 40;
            const barWidth = Math.max((containerWidth / arrayToSort.length) - 2, 6);

            arrayToSort.forEach((value, index) => {
                const bar = document.createElement('div');
                bar.className = 'bar';
                bar.style.height = `${(value / maxValue) * 250}px`;
                bar.style.width = `${barWidth}px`;
                bar.dataset.index = index;
                bar.dataset.value = value;

                const label = document.createElement('div');
                label.className = 'bar-label';
                label.textContent = value;
                bar.appendChild(label);

                container.appendChild(bar);
            });
        });
    }

    // --- CONTROL FUNCTIONS ---
    function handlePauseResume() {
        if (!isSorting) return;

        isPaused = !isPaused;
        if (isPaused) {
            if (pauseResumeBtn) pauseResumeBtn.innerHTML = '<i class="fas fa-play"></i>';
            updateExplanation('⏸️ Paused - Click resume to continue');
        } else {
            if (pauseResumeBtn) pauseResumeBtn.innerHTML = '<i class="fas fa-pause"></i>';
            if (pausePromiseResolver) {
                pausePromiseResolver();
                pausePromiseResolver = null;
            }
        }
    }

    function handleRestart() {
        currentSortExecutionId++;
        if (isPaused) {
            isPaused = false;
            if (pauseResumeBtn) pauseResumeBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }
        isSorting = false;
        enableControls(false);
        arrayToSort = [...initialArrayState];
        updateArrayDisplay();
        resetCounters();
        resetComparisonCounters();
        updateExplanation('🔄 Reset complete - Ready for another analysis!');
        clearVariables();
    }

    function handleSpeedChange(e) {
        animationSpeed = 600 - parseInt(e.target.value, 10);
    }

    function disableControls() {
        isSorting = true;
        if (analyzeSortBtn) {
            analyzeSortBtn.disabled = true;
            analyzeSortBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sorting...';
        }
        if (generateRandomBtn) generateRandomBtn.disabled = true;
        if (listInput) listInput.disabled = true;
        if (pauseResumeBtn) pauseResumeBtn.disabled = false;
        if (restartBtn) restartBtn.disabled = false;
    }

    function enableControls(isFinished = false) {
        isSorting = false;
        if (analyzeSortBtn) {
            analyzeSortBtn.disabled = false;
            analyzeSortBtn.innerHTML = '<i class="fas fa-play"></i> Analyze & Sort';
        }
        if (generateRandomBtn) generateRandomBtn.disabled = false;
        if (listInput) listInput.disabled = false;
        if (pauseResumeBtn) {
            pauseResumeBtn.disabled = true;
            pauseResumeBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }
        if (restartBtn) restartBtn.disabled = !isFinished;
    }

    function updateUI() {
        // Update any UI elements that need refreshing
    }

    // --- MODAL FUNCTIONS ---
    function showModal(modal) {
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    }

    function hideModal(modal) {
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    }

    function showAlgorithmDetails() {
        if (!recommendedAlgorithm || !infoModal) return;

        const algorithm = recommendedAlgorithm.algorithm;
        const algoData = ALGORITHMS[algorithm];

        const modalBody = document.getElementById('modal-body');
        if (modalBody) {
            modalBody.innerHTML = `
                <div class="algorithm-details">
                    <h4>${algoData.name}</h4>
                    <p class="algo-explanation">${algoData.explanation}</p>

                    <h5>Time & Space Complexity</h5>
                    <div class="complexity-table">
                        <div class="complexity-row">
                            <span>Best Case:</span>
                            <code>${algoData.complexity.best}</code>
                        </div>
                        <div class="complexity-row">
                            <span>Average Case:</span>
                            <code>${algoData.complexity.average}</code>
                        </div>
                        <div class="complexity-row">
                            <span>Worst Case:</span>
                            <code>${algoData.complexity.worst}</code>
                        </div>
                        <div class="complexity-row">
                            <span>Space Complexity:</span>
                            <code>${algoData.complexity.space}</code>
                        </div>
                    </div>

                    <h5>Why This Algorithm?</h5>
                    <p>${recommendedAlgorithm.reason}</p>

                    <div class="recommendation-details">
                        <div class="detail-item">
                            <strong>Confidence Level:</strong> ${Math.round(recommendedAlgorithm.confidence * 100)}%
                        </div>
                        <div class="detail-item">
                            <strong>Estimated Time:</strong> ~${recommendedAlgorithm.estimatedTime}ms
                        </div>
                        <div class="detail-item">
                            <strong>Array Size:</strong> ${arrayToSort.length} elements
                        </div>
                    </div>
                </div>
            `;
        }

        showModal(infoModal);
    }

    // --- FIXED CODE GENERATION ---
    function handleCodeGeneration(e) {
        const lang = e.target.closest('.code-btn')?.dataset.lang;
        const algorithm = currentMode === 'single' ? recommendedAlgorithm?.algorithm : algorithm1Select?.value || 'bubble';

        if (!algorithm) {
            showMessage('Please select or analyze an algorithm first!', 'warning');
            return;
        }

        if (!lang) {
            showMessage('Could not detect programming language!', 'error');
            return;
        }

        generateCode(algorithm, lang);
    }

    function generateCode(algorithm, language) {
        const template = CODE_TEMPLATES[language]?.[algorithm];

        if (!template) {
            showMessage(`Code template for ${ALGORITHMS[algorithm]?.name || algorithm} in ${language} is not available yet.`, 'warning');
            return;
        }

        const languageNames = {
            python: 'Python',
            cpp: 'C++',
            java: 'Java',
            javascript: 'JavaScript'
        };

        const fileExtensions = {
            python: '.py',
            cpp: '.cpp',
            java: '.java',
            javascript: '.js'
        };

        if (codeLangTitle) codeLangTitle.textContent = languageNames[language];
        if (codeFilename) codeFilename.textContent = `${algorithm}_sort${fileExtensions[language]}`;
        if (generatedCode) {
            generatedCode.textContent = template;
            generatedCode.className = `language-${language}`;
        }

        showModal(codeModal);
    }

    function copyCodeToClipboard() {
        const code = generatedCode?.textContent;
        if (!code) {
            showMessage('No code to copy!', 'error');
            return;
        }

        navigator.clipboard.writeText(code).then(() => {
            const originalText = copyCodeBtn?.innerHTML;
            if (copyCodeBtn) {
                copyCodeBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                copyCodeBtn.style.background = '#10b981';

                setTimeout(() => {
                    if (copyCodeBtn && originalText) {
                        copyCodeBtn.innerHTML = originalText;
                        copyCodeBtn.style.background = '';
                    }
                }, 2000);
            }
        }).catch(() => {
            showMessage('Failed to copy code to clipboard', 'error');
        });
    }

    // --- MESSAGE SYSTEM ---
    function showMessage(message, type = 'info') {
        console.log(`${type.toUpperCase()}: ${message}`);

        // Create toast notification
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 24px;
            background: ${type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
            color: white;
            border-radius: 8px;
            z-index: 10000;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    // Initialize the application
    init();
});